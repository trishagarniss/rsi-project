from src.backend.database.engine import SessionLocal
from src.backend.models.user import User
from src.backend.models.enums import UserRole
from src.backend.middlewares.auth import get_password_hash

def seed_data():
    # Buka koneksi ke database
    db = SessionLocal()
    try:
        # Data anggota
        admins = [
            {"id": "U_SUPER_01", "fullname": "Trisha Garnis Wahningyun", "email": "trisha@asgard.com"},
            {"id": "U_SUPER_02", "fullname": "Alvian Damar Budhi Hernowo", "email": "alvian@asgard.com"},
            {"id": "U_SUPER_03", "fullname": "Fathul Fajar Nur Ikhsan", "email": "fathul@asgard.com"},
            {"id": "U_SUPER_04", "fullname": "Kunto Rossindu Hidayattullah", "email": "kunto@asgard.com"},
            {"id": "U_SUPER_05", "fullname": "Zaki Elias Al Haqqanikudus", "email": "zaki@asgard.com"},
        ]

        # Hash password menggunakan fungsi asli sistemmu!
        hashed_pw = get_password_hash("password123")
        
        count = 0
        for admin_data in admins:
            # Cek agar tidak error jika dijalankan 2 kali (mencegah duplikat)
            existing_user = db.query(User).filter(User.email == admin_data["email"]).first()
            if not existing_user:
                new_user = User(
                    id=admin_data["id"],
                    tenant_id=None,
                    fullname=admin_data["fullname"],
                    email=admin_data["email"],
                    password_hash=hashed_pw,
                    role=UserRole.SUPERADMIN,
                    is_active=True
                )
                db.add(new_user)
                count += 1
        
        db.commit()
        print(f"✅ Berhasil menyuntikkan {count} akun Superadmin ke database!")
    
    except Exception as e:
        db.rollback()
        print(f"❌ Terjadi kesalahan: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Memulai proses seeding data...")
    seed_data()