import csv
import io
from fastapi import Depends, HTTPException, status, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..database.engine import get_db
from ..middlewares.auth import require_role
from ..models.user import User
from ..models.student import Student
from ..models.academic import Academic
from ..models.attendance import Attendance
from ..models.socio_economic import SocioEconomic
from ..dto.import_schema import IMPORT_SCHEMA_HEADER, CSV_TEMPLATE_CONTENT, ImportResult
from ..services.audit_service import log_action

async def download_template():
    return StreamingResponse(
        io.StringIO(CSV_TEMPLATE_CONTENT),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=import_template.csv"},
    )

async def upload_csv(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"])),
):
    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File harus berformat CSV")

    content = await file.read()
    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError:
        text = content.decode("latin-1")

    reader = csv.DictReader(io.StringIO(text))
    if not reader.fieldnames:
        raise HTTPException(status_code=400, detail="CSV kosong atau tidak valid")

    missing = [c for c in ["nis", "name", "class_name"] if c not in reader.fieldnames]
    if missing:
        raise HTTPException(status_code=400, detail=f"Kolom wajib hilang: {', '.join(missing)}")

    rows = list(reader)
    total = len(rows)
    success = 0
    errors = []
    tenant_id = current_user.tenant_id

    for i, row in enumerate(rows, 1):
        try:
            nis = row.get("nis", "").strip()
            if not nis:
                errors.append({"row": i, "error": "NIS kosong"})
                continue

            name = row.get("name", "").strip()
            class_name = row.get("class_name", "").strip()
            if not name or not class_name:
                errors.append({"row": i, "error": "Nama atau kelas kosong"})
                continue

            tingkat = row.get("tingkat", "").strip()
            jurusan = row.get("jurusan", "").strip() or None
            tahun_ajaran = row.get("tahun_ajaran", "").strip() or f"{2024}/2025"
            semester = int(row.get("semester", 1))
            hadir = int(row.get("hadir", 0))
            sakit = int(row.get("sakit", 0) or 0)
            izin = int(row.get("izin", 0) or 0)
            alpha = int(row.get("alpha", 0))
            total_hari = int(row.get("total_hari", 0))

            existing = await db.execute(
                select(Student).where(Student.tenant_id == tenant_id, Student.nis == nis)
            )
            student = existing.scalar_one_or_none()
            if student:
                student.name = name
                student.class_name = class_name
            else:
                student = Student(tenant_id=tenant_id, nis=nis, name=name, class_name=class_name)
                db.add(student)
            await db.flush()

            rata_rata_nilai = _parse_float(row.get("rata_rata_nilai"))
            jumlah_mapel_tidak_tuntas = _parse_int(row.get("jumlah_mapel_tidak_tuntas"))
            kenaikan_kelas = _parse_bool(row.get("kenaikan_kelas"))

            academic = Academic(
                student_id=student.id,
                tenant_id=tenant_id,
                semester=semester,
                tahun_ajaran=tahun_ajaran,
                tingkat=tingkat,
                jurusan=jurusan,
                rata_rata_nilai=rata_rata_nilai,
                jumlah_mapel_tidak_tuntas=jumlah_mapel_tidak_tuntas,
                kenaikan_kelas=kenaikan_kelas,
            )
            db.add(academic)

            persentase = round((hadir / total_hari) * 100, 2) if total_hari > 0 else 0.0
            attendance = Attendance(
                student_id=student.id,
                tenant_id=tenant_id,
                semester=semester,
                tahun_ajaran=tahun_ajaran,
                hadir=hadir,
                sakit=sakit,
                izin=izin,
                alpha=alpha,
                total_hari=total_hari,
                persentase_kehadiran=persentase,
            )
            db.add(attendance)

            socio_data = {
                "penghasilan_ortu": _parse_float(row.get("penghasilan_ortu")),
                "jumlah_tanggungan": _parse_int(row.get("jumlah_tanggungan")),
                "pendidikan_ayah": row.get("pendidikan_ayah", "").strip() or None,
                "pendidikan_ibu": row.get("pendidikan_ibu", "").strip() or None,
                "penerima_kip": _parse_bool(row.get("penerima_kip")),
                "jarak_rumah_sekolah": _parse_float(row.get("jarak_rumah_sekolah")),
            }

            existing_socio = await db.execute(
                select(SocioEconomic).where(
                    SocioEconomic.student_id == student.id,
                    SocioEconomic.tenant_id == tenant_id,
                )
            )
            socio = existing_socio.scalar_one_or_none()
            if socio:
                for k, v in socio_data.items():
                    if v is not None:
                        setattr(socio, k, v)
            else:
                socio = SocioEconomic(student_id=student.id, tenant_id=tenant_id, **{k: v for k, v in socio_data.items() if v is not None})
                db.add(socio)

            await db.flush()
            success += 1

        except Exception as e:
            errors.append({"row": i, "error": str(e)})

    await db.commit()
    await log_action(
        db, tenant_id, current_user.id,
        "import", "csv", None,
        f"Import CSV: {total} baris, {success} sukses, {total - success} gagal",
    )
    return ImportResult(total_rows=total, success_count=success, failed_count=total - success, errors=errors)


def _parse_float(val):
    if val is None or val.strip() == "":
        return None
    try:
        return float(val.strip())
    except ValueError:
        return None

def _parse_int(val):
    if val is None or val.strip() == "":
        return None
    try:
        return int(val.strip())
    except ValueError:
        return None

def _parse_bool(val):
    if val is None or val.strip() == "":
        return None
    return val.strip().upper() in ("1", "TRUE", "YES", "Y", "YA")
