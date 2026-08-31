from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel,Field
import joblib
import numpy as np
app = FastAPI(title="Enterprise AI Integration Gateway",
              description = "Production REST API serving AI?ML churn predictions",
              version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
try:
    model = joblib.load("backend/model.pkl")
except Exception:
    model = joblib.load("model.pkl")
class CustomerPayload(BaseModel):
    tenure_months: int = Field(..., ge=1,description="Duration of customer relationship in months",example=12)
    monthly_charges:float = Field(..., gt=0.0,description="Total billed amount each month",example=75.5)
    support_tickets: int = Field(..., ge=0,description="Total customer service support cases opened",example=2)
    contract_type_year: int = Field(...,ge=0,le=1,description="Binary contract type:1 for annual,0 for monthly",example=1)
@app.get("/health",status_code=200)
def check_health():
    return {"status":"healthy",
            "service": "AI Integration Gateway",
            "model_loaded": model is not None
            }
@app.post("/predict")
def predict_churn_risk(payload: CustomerPayload):
    try:
        input_data = np.array([[
            payload.tenure_months,
            payload.monthly_charges,
            payload.support_tickets,
            payload.contract_type_year

        ]])
        churn_probability = float(model.predict_proba(input_data)[0][1])
        if churn_probability >= 0.7:
            risk_tier ="CRITICAL"
            recommended_action = "Assig Account Manager immediately."
        elif churn_probability >= 0.4:
            risk_tier = "MODERATE"
            recommended_action = "Offer promotional retention discount"
        else:
            risk_tier = "Low"
            recommended_action = "No intervention needed."
        return {
            "risk_score": round(churn_probability,4),
            "risk_tier": risk_tier,
            "recommended_action": recommended_action,
            "inputs_processed": payload.dict()
        }
    except Exception as error:
        raise HTTPException(status_code=500,detail=f"Inference Engine Failed: {str(error)}")