from fastapi.testclient import TestClient
from main import app
client = TestClient(app)
def test_system_health():
    """
    verifies that the /health endpoint responds with HTTP 200 OK 
    and returns a valid operational status.
    """
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
def test_predict_churn_risk_valid():
    """
    Verifies that sending a valid customer metric payload returns a successful
    prediction score,a risk tier classification,and an actionable recommendation.
    """
    valid_payload = {
        "tenure_months":6,
        "monthly_charges": 95.50,
        "support_tickets": 4,
        "contract_type_year": 0
    }
    response = client.post("/predict",json=valid_payload)
    assert response.status_code == 200
    data = response.json()
    assert "risk_score" in data
    assert "risk_tier" in data
    assert "recommended_action" in data
    assert 0.0 <= data["risk_score"] <= 1.0
    assert data["risk_tier"] in ["CRITICAL","MODERATE","LOW"]
def test_predict_churn_risk_invalid_tenure():
    """
    Verifies that Pydantic rejects invalid inputs (e.g., negative tenure)
    with an HTTP 422 Unprocessable Entity error status code.
    """
    invalid_payload = {
        "tenure_months": -5,
        "monthly_charges": 80.0,
        "Support_tickets": 1,
        "contract_type_year": 1
    }
    response = client.post("/predict",json=invalid_payload)
    assert response.status_code == 422
def test_predict_churn_risk_missing_field():
    """
    Verifies that missing required payload attributes trigger a validation error.
    """
    incomplete_payload = {
        "tenure_months": 12,
        "support_tickets": 2,
        "contract_type_year": 1
    }
    response = client.post("/predict",json=incomplete_payload)
    assert response.status_code == 422
    
