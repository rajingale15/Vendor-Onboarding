# Project: BharatNXT – Vendor Onboarding & Verification Portal
# Language: FastAPI (Python)
# Goal: Provide dynamic, automated vendor verification via API calls

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import random
import httpx

app = FastAPI()

# CORS setup for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- MODELS -------------------
class VendorForm(BaseModel):
    vendorName: str
    gstin: str
    email: str
    pan: Optional[str] = None
    website: Optional[str] = None
    address: str
    phone: str

class VerificationStep(BaseModel):
    name: str
    status: str
    message: str

# ⬇️  Updated VerificationResult with new fields
class VerificationResult(BaseModel):
    vendor: VendorForm
    steps: List[VerificationStep]
    completed: bool
    gstin_valid: Optional[bool] = None
    filing_status: Optional[str] = None
    google_results: Optional[List[Dict]] = None
    ecommerce_summary: Optional[str] = None

# ------------------- EXTERNAL API INTEGRATION -------------------
GST_API_URL = "https://domain-name/commonapi/v1.0/tpstatus"
SERP_API_URL = "https://serpapi.com/search?engine=google_maps_reviews"
SERP_API_KEY = "your_serp_api_key"  # Replace with real key

async def fetch_gstin_status(gstin: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(GST_API_URL, json={"gstin": gstin})
            response.raise_for_status()
            data = response.json()
            return {
                "valid": data.get("status") == "ACTIVE",
                "filing_status": data.get("filing_status", "unknown")
            }
    except Exception as e:
        return {"valid": False, "filing_status": "error"}

async def fetch_serpapi_reviews(business_name: str):
    try:
        params = {
            "engine": "google_maps_reviews",
            "q": business_name,
            "api_key": SERP_API_KEY
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(SERP_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
            reviews = data.get("reviews", [])
            summary = f"{len(reviews)} reviews fetched"
            return reviews, summary
    except Exception as e:
        return [], "Failed to fetch"

# ------------------- SIMULATED CHECKS -------------------
def simulate_check(name: str, description: str) -> VerificationStep:
    success = random.random() > 0.1  # 90% chance
    return VerificationStep(
        name=name,
        status="completed" if success else "failed",
        message=f"{description} - {'Completed' if success else 'Failed'}"
    )

# ------------------- API ROUTES -------------------
@app.post("/api/vendors/submit", response_model=VerificationResult)
async def submit_vendor(
    vendorName: str = Form(...),
    gstin: str = Form(...),
    email: str = Form(...),
    pan: Optional[str] = Form(None),
    website: Optional[str] = Form(None),
    address: str = Form(...),
    phone: str = Form(...),
    panDocument: Optional[UploadFile] = File(None),
    udyamCertificate: Optional[UploadFile] = File(None),
    tradeLicense: Optional[UploadFile] = File(None),
):
    vendor_data = VendorForm(
        vendorName=vendorName,
        gstin=gstin,
        email=email,
        pan=pan,
        website=website,
        address=address,
        phone=phone,
    )

    # === CALL REAL API ===
    gst_result = await fetch_gstin_status(gstin)
    google_reviews, ecommerce_summary = await fetch_serpapi_reviews(vendorName)

    steps = [
        VerificationStep(name="GSTIN Validation", status="completed" if gst_result["valid"] else "failed", message="GSTIN check completed."),
        VerificationStep(name="Filing Status", status="completed", message=f"Status: {gst_result['filing_status']}"),
        VerificationStep(name="Online Reputation Check", status="completed" if google_reviews else "failed", message=ecommerce_summary),
    ]

    completed = all(step.status == "completed" for step in steps)

    return VerificationResult(
        vendor=vendor_data,
        steps=steps,
        completed=completed,
        gstin_valid=gst_result["valid"],
        filing_status=gst_result["filing_status"],
        google_results=google_reviews,
        ecommerce_summary=ecommerce_summary
    )

@app.get("/api/vendors/{gstin}", response_model=VerificationResult)
def get_vendor_status(gstin: str):
    # Simulated single GET (in production, fetch from DB)
    vendor = VendorForm(
        vendorName="Mock Vendor",
        gstin=gstin,
        email="mock@example.com",
        address="Some address",
        phone="1234567890"
    )
    steps = [
        simulate_check("GSTIN Validation", "Mocked"),
        simulate_check("PAN Check", "Mocked"),
    ]
    return VerificationResult(vendor=vendor, steps=steps, completed=True)