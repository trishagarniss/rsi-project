from sqlalchemy.orm import Session, joinedload
from sqlalchemy.sql import func
from sqlalchemy import case
from src.backend.models.user import User
from src.backend.models.student import Student
from src.backend.models.risk_prediction import RiskPredictionLog
from src.backend.models.academic import Academic
from src.backend.models.attendance import Attendance
from src.backend.models.socio_economic import SocioEconomic
from src.backend.models.audit_log import AuditLog
from src.backend.models.enums import UserRole


def build_admin_dashboard(db: Session, current_user: User) -> dict:
    tenant_id = current_user.tenant_id

    # 1. Student counts
    total_active = (
        db.query(func.count(Student.id))
        .filter(Student.tenant_id == tenant_id, Student.is_active == True, Student.deleted_at == None)
        .scalar()
        or 0
    )
    total_inactive = (
        db.query(func.count(Student.id))
        .filter(Student.tenant_id == tenant_id, Student.is_active == False)
        .scalar()
        or 0
    )

    # 2. Counselor count
    total_counselors = (
        db.query(func.count(User.id))
        .filter(User.tenant_id == tenant_id, User.role == UserRole.COUNSELOR, User.is_active == True)
        .scalar()
        or 0
    )

    # 3. Risk prediction distribution (latest prediction per student)
    # Use a subquery to get the latest prediction per student
    latest_pred_subq = (
        db.query(
            RiskPredictionLog.student_id,
            func.max(RiskPredictionLog.created_at).label("max_created"),
        )
        .filter(RiskPredictionLog.tenant_id == tenant_id)
        .group_by(RiskPredictionLog.student_id)
        .subquery()
    )

    predictions = (
        db.query(RiskPredictionLog)
        .join(
            latest_pred_subq,
            (RiskPredictionLog.student_id == latest_pred_subq.c.student_id)
            & (RiskPredictionLog.created_at == latest_pred_subq.c.max_created),
        )
        .options(joinedload(RiskPredictionLog.student))
        .all()
    )

    total_predicted = len(predictions)
    tinggi = sum(1 for p in predictions if p.risk_score >= 0.8)
    sedang = sum(1 for p in predictions if 0.6 <= p.risk_score < 0.8)
    rendah = sum(1 for p in predictions if 0.4 <= p.risk_score < 0.6)
    aman = total_predicted - tinggi - sedang - rendah
    average_risk_score = round(sum(p.risk_score for p in predictions) / max(total_predicted, 1), 4)

    # 4. Top 5 critical students
    sorted_by_risk = sorted(predictions, key=lambda p: p.risk_score, reverse=True)[:5]
    top_critical = []
    for p in sorted_by_risk:
        student = p.student
        top_critical.append(
            {
                "student_id": p.student_id,
                "name": student.name if student else "N/A",
                "nis": student.nis if student else "-",
                "nisn": student.nisn if student else "-",
                "risk_score": p.risk_score,
                "risk_status": p.risk_status,
            }
        )

    # 5. Academic summary
    academic_stats = (
        db.query(
            func.avg(Academic.average_score).label("avg_score"),
            func.count(func.distinct(Academic.student_id)).label("students_with_academic"),
        )
        .filter(Academic.tenant_id == tenant_id, Academic.deleted_at == None)
        .first()
    )
    avg_academic_score = round(academic_stats.avg_score, 2) if academic_stats and academic_stats.avg_score else None

    students_with_failures = (
        db.query(func.count(func.distinct(Academic.student_id)))
        .filter(
            Academic.tenant_id == tenant_id,
            Academic.deleted_at == None,
            Academic.failed_subjects_count > 0,
        )
        .scalar()
        or 0
    )

    # 6. Attendance summary
    attendance_stats = (
        db.query(
            func.avg(Attendance.attendance_percentage).label("avg_percentage"),
            func.count(func.distinct(Attendance.student_id)).label("students_with_attendance"),
        )
        .filter(Attendance.tenant_id == tenant_id, Attendance.deleted_at == None)
        .first()
    )
    avg_attendance_percentage = (
        round(attendance_stats.avg_percentage, 2) if attendance_stats and attendance_stats.avg_percentage else None
    )

    # 7. Data completeness
    students_with_academic = (
        db.query(func.count(func.distinct(Academic.student_id)))
        .filter(Academic.tenant_id == tenant_id, Academic.deleted_at == None)
        .scalar()
        or 0
    )
    students_with_attendance = (
        db.query(func.count(func.distinct(Attendance.student_id)))
        .filter(Attendance.tenant_id == tenant_id, Attendance.deleted_at == None)
        .scalar()
        or 0
    )
    students_with_socio = (
        db.query(func.count(func.distinct(SocioEconomic.student_id)))
        .filter(SocioEconomic.tenant_id == tenant_id, SocioEconomic.deleted_at == None)
        .scalar()
        or 0
    )

    # 8. Recent activities (last 10 audit logs)
    recent_logs = (
        db.query(AuditLog)
        .filter(AuditLog.tenant_id == tenant_id)
        .order_by(AuditLog.created_at.desc())
        .limit(10)
        .all()
    )
    recent_activities = []
    for log in recent_logs:
        user_name = "-"
        if log.user:
            user_name = log.user.fullname
        recent_activities.append(
            {
                "id": log.id,
                "action": log.action,
                "entity_name": log.entity_name,
                "entity_id": log.entity_id,
                "user_name": user_name,
                "user_id": log.user_id,
                "ip_address": log.ip_address,
                "created_at": log.created_at.isoformat() if log.created_at else None,
            }
        )

    return {
        "students": {
            "total_active": total_active,
            "total_inactive": total_inactive,
        },
        "users": {
            "total_counselors": total_counselors,
        },
        "predictions": {
            "total_predicted": total_predicted,
            "average_risk_score": average_risk_score,
            "tinggi": tinggi,
            "sedang": sedang,
            "rendah": rendah,
            "aman": aman,
            "top_critical": top_critical,
        },
        "academic_summary": {
            "average_score": avg_academic_score,
            "students_with_failures": students_with_failures,
            "students_with_data": students_with_academic,
        },
        "attendance_summary": {
            "average_percentage": avg_attendance_percentage,
            "students_with_data": students_with_attendance,
        },
        "data_completeness": {
            "with_academic": students_with_academic,
            "with_attendance": students_with_attendance,
            "with_socio_economic": students_with_socio,
        },
        "recent_activities": recent_activities,
    }
