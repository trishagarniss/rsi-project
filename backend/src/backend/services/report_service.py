from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from ..models.student import Student
from ..models.risk_prediction import RiskPrediction
from ..models.intervention import Intervention
from ..models.academic import Academic
from ..models.attendance import Attendance
from ..models.socio_economic import SocioEconomic
from ..services.student_service import get_student as get_student_svc
from ..services.academic_service import get_academics
from ..services.attendance_service import get_attendances
from ..services.socio_economic_service import get_by_student as get_socio_svc
from ..services.prediction_service import get_latest_prediction, get_predictions_by_student
from ..services.counseling_service import get_interventions

async def get_student_report(db: AsyncSession, tenant_id: int, student_id: int) -> dict:
    student = await get_student_svc(db, tenant_id, student_id)
    if not student:
        raise ValueError("Siswa tidak ditemukan")

    academics, _ = await get_academics(db, tenant_id, limit=100, student_id=student_id)
    attendances, _ = await get_attendances(db, tenant_id, limit=100, student_id=student_id)
    socio = await get_socio_svc(db, tenant_id, student_id)
    prediction = await get_latest_prediction(db, tenant_id, student_id)
    interventions, _ = await get_interventions(db, tenant_id, limit=100, student_id=student_id)

    return {
        "student": {
            "id": student.id, "nis": student.nis, "name": student.name,
            "class_name": student.class_name, "is_active": student.is_active,
            "created_at": student.created_at, "updated_at": student.updated_at,
        },
        "academics": [
            {
                "id": a.id, "semester": a.semester, "tahun_ajaran": a.tahun_ajaran,
                "tingkat": a.tingkat, "jurusan": a.jurusan,
                "rata_rata_nilai": a.rata_rata_nilai,
                "jumlah_mapel_tidak_tuntas": a.jumlah_mapel_tidak_tuntas,
                "kenaikan_kelas": a.kenaikan_kelas,
            }
            for a in academics
        ],
        "attendances": [
            {
                "id": at.id, "semester": at.semester, "tahun_ajaran": at.tahun_ajaran,
                "hadir": at.hadir, "sakit": at.sakit, "izin": at.izin, "alpha": at.alpha,
                "total_hari": at.total_hari, "persentase_kehadiran": at.persentase_kehadiran,
            }
            for at in attendances
        ],
        "socio_economic": {
            "penghasilan_ortu": socio.penghasilan_ortu,
            "jumlah_tanggungan": socio.jumlah_tanggungan,
            "pendidikan_ayah": socio.pendidikan_ayah,
            "pendidikan_ibu": socio.pendidikan_ibu,
            "pekerjaan_ayah": socio.pekerjaan_ayah,
            "pekerjaan_ibu": socio.pekerjaan_ibu,
            "status_rumah": socio.status_rumah,
            "penerima_kip": socio.penerima_kip,
            "jarak_rumah_sekolah": socio.jarak_rumah_sekolah,
            "transportasi": socio.transportasi,
        } if socio else None,
        "latest_prediction": {
            "id": p.id, "skor_risiko": p.skor_risiko, "label_risiko": p.label_risiko.value,
            "tanggal_prediksi": p.tanggal_prediksi, "model_version": p.model_version,
            "fitur_snapshot": p.fitur_snapshot,
        } if prediction else None,
        "interventions": [
            {
                "id": i.id, "jenis": i.jenis.value, "status": i.status.value,
                "tanggal_intervensi": i.tanggal_intervensi, "catatan": i.catatan,
                "tindak_lanjut": i.tindak_lanjut, "created_at": i.created_at,
            }
            for i in interventions
        ],
    }

async def get_class_report(db: AsyncSession, tenant_id: int, class_name: str) -> dict:
    students_result = await db.execute(
        select(Student).where(Student.tenant_id == tenant_id, Student.class_name == class_name, Student.is_active == True)
    )
    students = list(students_result.scalars().all())

    latest_subq = (
        select(
            RiskPrediction.student_id,
            RiskPrediction.skor_risiko,
            RiskPrediction.label_risiko,
            RiskPrediction.tanggal_prediksi,
            func.row_number().over(
                partition_by=RiskPrediction.student_id,
                order_by=RiskPrediction.created_at.desc(),
            ).label("rn"),
        )
        .where(RiskPrediction.tenant_id == tenant_id)
        .subquery()
    )

    items = []
    tinggi = sedang = rendah = 0

    for s in students:
        pred_result = await db.execute(
            select(
                latest_subq.c.skor_risiko,
                latest_subq.c.label_risiko,
            )
            .where(latest_subq.c.student_id == s.id, latest_subq.c.rn == 1)
        )
        pred_row = pred_result.one_or_none()

        inter_count = (
            await db.execute(
                select(func.count()).where(Intervention.student_id == s.id, Intervention.tenant_id == tenant_id)
            )
        ).scalar()

        inter_last = await db.execute(
            select(Intervention.tanggal_intervensi)
            .where(Intervention.student_id == s.id, Intervention.tenant_id == tenant_id)
            .order_by(Intervention.tanggal_intervensi.desc())
            .limit(1)
        )
        last_inter = inter_last.scalar_one_or_none()

        skor = float(pred_row.skor_risiko) if pred_row and pred_row.skor_risiko else None
        label = pred_row.label_risiko.value if pred_row and pred_row.label_risiko else None

        if label == "tinggi":
            tinggi += 1
        elif label == "sedang":
            sedang += 1
        else:
            rendah += 1

        items.append({
            "id": s.id,
            "nis": s.nis,
            "name": s.name,
            "skor_risiko": skor,
            "label_risiko": label,
            "total_intervensi": inter_count,
            "intervensi_terakhir": last_inter,
        })

    items.sort(key=lambda x: x["skor_risiko"] or 0, reverse=True)

    return {
        "class_name": class_name,
        "total_siswa": len(students),
        "total_berisiko_tinggi": tinggi,
        "total_berisiko_sedang": sedang,
        "total_berisiko_rendah": rendah,
        "students": items,
    }

async def get_export_report(db: AsyncSession, tenant_id: int) -> dict:
    students_result = await db.execute(
        select(Student).where(Student.tenant_id == tenant_id, Student.is_active == True).order_by(Student.name)
    )
    students = list(students_result.scalars().all())

    items = []
    for s in students:
        pred = await get_latest_prediction(db, tenant_id, s.id)

        latest_acad = await db.execute(
            select(Academic).where(Academic.student_id == s.id).order_by(Academic.semester.desc()).limit(1)
        )
        acad = latest_acad.scalar_one_or_none()

        latest_att = await db.execute(
            select(Attendance).where(Attendance.student_id == s.id).order_by(Attendance.semester.desc()).limit(1)
        )
        att = latest_att.scalar_one_or_none()

        inter_count = (
            await db.execute(
                select(func.count()).where(Intervention.student_id == s.id, Intervention.tenant_id == tenant_id)
            )
        ).scalar()

        items.append({
            "nis": s.nis,
            "name": s.name,
            "class_name": s.class_name,
            "rata_rata_nilai": acad.rata_rata_nilai if acad else None,
            "persentase_kehadiran": att.persentase_kehadiran if att else None,
            "alpha": att.alpha if att else 0,
            "skor_risiko": pred.skor_risiko if pred else None,
            "label_risiko": pred.label_risiko.value if pred else None,
            "tanggal_prediksi": pred.tanggal_prediksi if pred else None,
            "total_intervensi": inter_count,
        })

    return {"total": len(items), "items": items}
