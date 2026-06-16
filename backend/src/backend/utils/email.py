import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from src.backend.config.settings import settings

EMAIL_PENGIRIM = settings.EMAIL_SENDER
PASSWORD_PENGIRIM = settings.EMAIL_PASSWORD
SMTP_SERVER = settings.SMTP_HOST
SMTP_PORT = settings.SMTP_PORT

def send_email(to_email: str, subject: str, html_body: str):
    if not EMAIL_PENGIRIM or not PASSWORD_PENGIRIM:
        raise Exception("Konfigurasi email SMTP belum diatur.")
    msg = MIMEMultipart('alternative')
    msg['From'] = EMAIL_PENGIRIM
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(html_body, 'html'))

    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
        server.login(EMAIL_PENGIRIM, PASSWORD_PENGIRIM)
        server.sendmail(EMAIL_PENGIRIM, to_email, msg.as_string())
