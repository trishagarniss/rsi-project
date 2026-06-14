import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

EMAIL_PENGIRIM = "asgardkelompok2@gmail.com"
PASSWORD_PENGIRIM = "ccyd usvm bccm uuhp"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465

def send_email(to_email: str, subject: str, html_body: str):
    msg = MIMEMultipart('alternative')
    msg['From'] = EMAIL_PENGIRIM
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(html_body, 'html'))

    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
        server.login(EMAIL_PENGIRIM, PASSWORD_PENGIRIM)
        server.sendmail(EMAIL_PENGIRIM, to_email, msg.as_string())
