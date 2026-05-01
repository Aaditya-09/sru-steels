"""
SRU Steels — Form Submission Backend
FastAPI + Resend email service
Deploy on Railway.app
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import resend
import os
from dotenv import load_dotenv

load_dotenv()

# ── Config ────────────────────────────────────────────────────────────────────
resend.api_key  = os.getenv("RESEND_API_KEY", "")
OWNER_EMAIL     = os.getenv("OWNER_EMAIL", "srusteels@yahoo.in")
FRONTEND_URL    = os.getenv("FRONTEND_URL", "*")
FROM_EMAIL      = os.getenv("FROM_EMAIL", "enquiry@srusteels.com")

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="SRU Steels API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:5500"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# ── Models ────────────────────────────────────────────────────────────────────
class QuoteForm(BaseModel):
    name: str
    phone: str
    product: str
    quantity: str = "Not specified"

class ContactForm(BaseModel):
    name: str
    company: str = ""
    email: str
    phone: str
    enquiry_type: str = "General"
    product: str = ""
    message: str = ""

# ── Helpers ───────────────────────────────────────────────────────────────────
def row(label: str, value: str) -> str:
    return f"""
    <tr>
      <td style="padding:10px 16px;background:#f8f9fb;border-bottom:1px solid #e2e8f0;
                 font-size:13px;color:#718096;font-weight:600;width:160px">{label}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;
                 font-size:13px;color:#1a1a2e">{value}</td>
    </tr>"""

def send_email(subject: str, html: str):
    if not resend.api_key:
        raise HTTPException(status_code=500, detail="Email service not configured")
    try:
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": OWNER_EMAIL,
            "subject": subject,
            "html": html,
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email send failed: {str(e)}")

# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/")
def health():
    return {"status": "SRU Steels API is running"}

@app.post("/api/quote")
async def submit_quote(form: QuoteForm):
    html = f"""
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0A1628;padding:28px 32px;border-radius:12px 12px 0 0">
        <div style="display:inline-block;background:#D4A017;color:#0A1628;
                    font-weight:900;font-size:18px;padding:8px 14px;border-radius:6px;
                    letter-spacing:1px">SRU</div>
        <span style="color:white;font-size:16px;font-weight:700;
                     margin-left:12px">SRU STEELS LIMITED</span>
        <p style="color:#C0C8D2;font-size:12px;margin:8px 0 0">
          New Quote Request — Action Required
        </p>
      </div>
      <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;
                  padding:24px 32px">
        <h2 style="color:#0A1628;font-size:18px;margin:0 0 20px">
          📋 New Quote Enquiry
        </h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;
                      border-radius:8px;overflow:hidden">
          {row("Name", form.name)}
          {row("Phone", form.phone)}
          {row("Product", form.product)}
          {row("Quantity", form.quantity)}
        </table>
        <div style="margin-top:24px;padding:16px;background:#fff8e6;
                    border:1px solid #D4A017;border-radius:8px;
                    font-size:13px;color:#b8880f">
          ⏱ Please respond within <strong>2 hours</strong> as committed on the website.
        </div>
      </div>
    </div>
    """
    send_email(f"🔔 New Quote Request — {form.product} | {form.name}", html)
    return {"status": "ok", "message": "Quote request received"}

@app.post("/api/contact")
async def submit_contact(form: ContactForm):
    html = f"""
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0A1628;padding:28px 32px;border-radius:12px 12px 0 0">
        <div style="display:inline-block;background:#D4A017;color:#0A1628;
                    font-weight:900;font-size:18px;padding:8px 14px;border-radius:6px;
                    letter-spacing:1px">SRU</div>
        <span style="color:white;font-size:16px;font-weight:700;
                     margin-left:12px">SRU STEELS LIMITED</span>
        <p style="color:#C0C8D2;font-size:12px;margin:8px 0 0">
          New Contact Form Submission
        </p>
      </div>
      <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;
                  padding:24px 32px">
        <h2 style="color:#0A1628;font-size:18px;margin:0 0 20px">
          📨 New Contact Enquiry — {form.enquiry_type}
        </h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;
                      border-radius:8px;overflow:hidden">
          {row("Name", form.name)}
          {row("Company", form.company or "—")}
          {row("Email", form.email)}
          {row("Phone", form.phone)}
          {row("Enquiry Type", form.enquiry_type)}
          {row("Product", form.product or "—")}
        </table>
        {"" if not form.message else f'''
        <div style="margin-top:16px">
          <div style="font-size:12px;font-weight:600;color:#718096;
                      text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">
            Message / Requirements
          </div>
          <div style="background:#f8f9fb;border:1px solid #e2e8f0;border-radius:8px;
                      padding:14px;font-size:13px;color:#1a1a2e;line-height:1.6">
            {form.message}
          </div>
        </div>'''}
        <div style="margin-top:24px;padding:16px;background:#fff8e6;
                    border:1px solid #D4A017;border-radius:8px;
                    font-size:13px;color:#b8880f">
          ⏱ Respond within <strong>4 hours</strong> (bulk orders within 2 hours).
        </div>
      </div>
    </div>
    """
    send_email(
        f"📬 Contact Form — {form.enquiry_type} | {form.name}"
        + (f" ({form.company})" if form.company else ""),
        html
    )
    return {"status": "ok", "message": "Message received"}