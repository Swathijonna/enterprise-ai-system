import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report,roc_auc_score
from xgboost import XGBClassifier
import shap
import joblib
import mlflow
import mlflow.sklearn
mlflow.set_experiment("Customer_Risk_Intelligence")
def generate_synthetic_data(num_samples=1000):
    np.random.seed(42)
    tenure_months = np.random.randint(1,72,size=num_samples)
    monthly_charges = np.random.uniform(20.0,120.0,size=num_samples)
    support_tickets = np.random.randint(0,10,size=num_samples)
    contract_type_year = np.random.choice([0,1],size=num_samples)
    churn_score = (
        (support_tickets * 0.3)
        + (monthly_charges * 0.01)
        - (tenure_months * 0.02)
        - (contract_type_year * 0.5)
    )
    churn_probability = 1 / (1 + np.exp(-churn_score))
    churn = (churn_probability > 0.5).astype(int)
    df = pd.DataFrame(
        {
            "tenure_months": tenure_months,
            "monthly_charges": monthly_charges,
            "support_tickets": support_tickets,
            "contract_type_year": contract_type_year,
            "churn": churn,
        }
    )
    return df
def execute_ml_pipeline():
    df = generate_synthetic_data(1000)
    X = df.drop(columns=["churn"])
    y = df["churn"]
    X_train, X_test, y_train, y_test = train_test_split(X, y,test_size=0.2,random_state=42)
    model = XGBClassifier(n_estimators=100,max_depth=5,learning_rate=0.1,random_state=42)
    model.fit(X_train,y_train)
    predictions = model.predict(X_test)
    probabilities = model.predict_proba(X_test)[:,1]
    auc_score = roc_auc_score(y_test,probabilities)
    print("=== STATISTICAL MODEL PERFORMANCE ===")
    print(classification_report(y_test, predictions))
    print(f"ROC-AUC Score: {auc_score:.4f}")
    explainer = shap.TreeExplainer(model)
    shap_values = explainer(X_test)
    print(
            "Mean SHAP Value for Feature 1:",
            np.abs(shap_values.values).mean(axis=0)[0],
        )
    mlflow.log_param("model_type", "XGBoost")
    mlflow.log_param("n_estimators", 100)
    mlflow.log_metric("auc_score", auc_score)
    mlflow.sklearn.log_model(model, "xgboost_model")
    joblib.dump(model, "backend/model.pkl")
    print("Model saved successfully to backend/model.pkl")
if __name__ == "__main__":
   
    execute_ml_pipeline()

