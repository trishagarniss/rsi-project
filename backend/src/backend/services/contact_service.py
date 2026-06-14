from fastapi import HTTPException
from src.backend.utils.email import send_email

TARGET_EMAIL = "asgardkelompok2@gmail.com"

NOTIF_HTML = """\
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #F8FAFC; padding: 20px; color: #334155; margin: 0; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 16px; border: 3px solid #161D6F; box-shadow: 8px 8px 0px 0px #FFC107; }}
        .header {{ border-bottom: 3px solid #FFC107; padding-bottom: 20px; margin-bottom: 25px; }}
        .badge {{ display: inline-block; background-color: #161D6F; color: #FFC107; padding: 6px 14px; border-radius: 8px; font-weight: 900; font-size: 12px; letter-spacing: 1px; }}
        .field {{ margin-bottom: 20px; }}
        .label {{ font-size: 11px; font-weight: 900; color: #161D6F; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }}
        .value {{ font-size: 15px; color: #334155; background: #F8FAFC; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #FFC107; }}
        .footer {{ text-align: center; margin-top: 30px; font-size: 12px; color: #94A3B8; border-top: 2px dashed #E2E8F0; padding-top: 20px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="badge">A.S.G.A.R.D</span>
            <h2 style="color: #161D6F; margin: 10px 0 0;">Pesan Baru dari Form Contact</h2>
        </div>
        <div class="field">
            <div class="label">Nama</div>
            <div class="value">{name}</div>
        </div>
        <div class="field">
            <div class="label">Email</div>
            <div class="value">{email}</div>
        </div>
        <div class="field">
            <div class="label">Subjek</div>
            <div class="value">{subject}</div>
        </div>
        <div class="field">
            <div class="label">Pesan</div>
            <div class="value">{message}</div>
        </div>
        <div class="footer">
            <p>&copy; 2026 ASGARD System &bull; Universitas Sebelas Maret</p>
        </div>
    </div>
</body>
</html>
"""

CONFIRM_HTML = """\
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #F8FAFC; padding: 20px; color: #334155; margin: 0; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 16px; border: 3px solid #161D6F; box-shadow: 8px 8px 0px 0px #FFC107; text-align: center; }}
        .badge {{ display: inline-block; background-color: #161D6F; color: #FFC107; padding: 6px 14px; border-radius: 8px; font-weight: 900; font-size: 12px; letter-spacing: 1px; margin-bottom: 20px; }}
        h2 {{ color: #161D6F; font-weight: 900; font-size: 24px; margin: 10px 0; }}
        p {{ font-size: 15px; line-height: 1.7; color: #475569; max-width: 480px; margin: 16px auto; }}
        .check {{ font-size: 48px; margin: 10px 0; }}
        .footer {{ text-align: center; margin-top: 30px; font-size: 12px; color: #94A3B8; border-top: 2px dashed #E2E8F0; padding-top: 20px; }}
    </style>
</head>
<body>
    <div class="container">
        <span class="badge">A.S.G.A.R.D</span>
        <div class="check">&#10004;</div>
        <h2>Pesan Anda Telah Kami Terima</h2>
        <p>Halo <strong>{name}</strong>,</p>
        <p>Terima kasih sudah menghubungi tim ASGARD. Pesan Anda dengan subjek <strong>"{subject}"</strong> telah berhasil kami terima dan akan segera kami baca.</p>
        <p>Tim kami akan merespons Anda dalam waktu 1x24 jam melalui email ini. Jika ada informasi tambahan, jangan ragu untuk menghubungi kami kembali.</p>
        <div class="footer">
            <p>&copy; 2026 ASGARD System &bull; Universitas Sebelas Maret</p>
        </div>
    </div>
</body>
</html>
"""

def process_contact(name: str, email: str, subject: str, message: str):
    try:
        send_email(TARGET_EMAIL, f"[Contact Form] {subject}", NOTIF_HTML.format(name=name, email=email, subject=subject, message=message))
        send_email(email, f"Terima kasih telah menghubungi ASGARD — {subject}", CONFIRM_HTML.format(name=name, subject=subject))
    except Exception:
        raise HTTPException(status_code=500, detail="Gagal mengirim pesan. Silakan coba lagi.")
