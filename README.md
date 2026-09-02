# Enterprise AI Churn Prediction System 🤖

An enterprise-grade Machine Learning microservice and interactive dashboard built to predict customer churn risk in real time and deliver prescriptive retention strategies. Powered by a trained classification model, a high-performance FastAPI microservice backend, and a React dark-mode dashboard.

---

## 🎯 Project Overview & Core Logic

### 1. Business Problem
Customer churn directly impacts Annual Recurring Revenue (ARR). Identifying high-risk accounts *after* cancellation occurs is inefficient. This project provides an automated risk intelligence pipeline that evaluates customer operational behavior to calculate churn probability prior to renewal windows.

### 2. End-to-End Operational Workflow
1. **Feature Extraction:** Captures four core operational metrics:
   * **Tenure (Months):** Duration of customer relationship (account maturity).
   * **Monthly Charges ($):** Current monthly billing rate (price sensitivity).
   * **Support Tickets:** Count of unresolved support requests (product friction).
   * **Contract Type:** Contract commitment flag (annual vs. month-to-month).

2. **Validation Layer:** The API gateway validates incoming fields against strict schema definitions and range constraints to prevent runtime anomalies.

3. **Inference Execution:** Validated features are passed to the trained classification model (`model.pkl`). The model outputs a normalized churn probability score from `0.00` to `1.00`.

4. **Prescriptive Action Engine:** The probability score passes through an automated decision matrix that assigns a **Risk Classification Tier** (`LOW`, `MODERATE`, `CRITICAL`) and attaches targeted mitigation instructions.

5. **Dynamic Dashboard Rendering:** The single-page interface renders the evaluated payload, color-coded status badges, and action recommendations instantly.

---

## 🔄 System Architecture

```text
enterprise-ai-system/
├── backend/
│   ├── main.py              # API application, CORS rules, & route handlers
│   ├── train_model.py       # Pipeline script generating model artifact
│   ├── model.pkl            # Serialized binary classification model
│   └── requirements.txt     # Backend Python dependencies
├── frontend/
│   ├── index.html           # HTML container & CDN dependencies
│   └── App.jsx              # React single-page UI & state management
├── tests/
│   └── test_api.py          # Pytest integration suite
├── .env.example             # Safe environment variable template
├── .gitignore               # Excludes virtual environments & secrets
└── README.md                # Public documentation
## 🛠️ Tech Stack

| **Layer**             | **Technology**         | **Purpose**                                      |
|-----------------------|------------------------|--------------------------------------------------|
| **Language**          | Python 3.11            | Primary development runtime                     |
| **ML Engine**         | XGBoost / Scikit-Learn | Supervised machine learning classification     |
| **Backend API**       | FastAPI / Uvicorn      | Asynchronous REST microservice                  |
| **Validation**        | Pydantic               | Schema verification & type safety               |
| **Frontend**          | React 18 / Babel       | Dynamic UI rendering & state management         |
| **Testing**           | Pytest                 | Automated endpoint integration testing          |
| **Model Persistence** | Joblib                 | Binary model serialization and loading          |
