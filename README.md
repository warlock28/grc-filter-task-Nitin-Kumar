# GRC Risk Assessment & Heatmap Dashboard

## Project Overview
This project is a production-grade Governance, Risk, and Compliance (GRC) assessment tool designed to help organizations identify, score, and visualize risks according to NIST SP 800-30 standards. It creates a seamless workflow from risk identification to mitigation prioritization using an interactive dashboard.

## Setup Instructions

### Backend Setup
1.  Navigate to the `backend` directory.
    ```bash
    cd backend
    ```
2.  Initialize a virtual environment (optional but recommended).
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # Mac/Linux:
    source venv/bin/activate
    ```
3.  Install dependencies.
    ```bash
    pip install fastapi uvicorn pydantic
    ```
4.  Run the application.
    ```bash
    uvicorn app:app --reload
    ```
    The API will be available at `http://localhost:8000`.

### Frontend Setup
1.  Navigate to the `frontend` directory.
    ```bash
    cd frontend
    ```
2.  Install dependencies.
    ```bash
    npm install
    ```
3.  Start the development server.
    ```bash
    npm start
    ```
    The application will run at `http://localhost:3000`.

## Risk Scoring Logic
The system uses a qualitative scoring model based on Risk = Likelihood × Impact.

-   **Fields:**
    -   **Likelihood:** 1 (Rare) to 5 (Almost Certain)
    -   **Impact:** 1 (Insignificant) to 5 (Catastrophic)
-   **Calculation:** Score = Likelihood × Impact (Range: 1–25)
-   **Level Mapping:**
    -   **Low (1–5):** Acceptable risk, monitor.
    -   **Medium (6–12):** Tolerable, plan mitigation.
    -   **High (13–18):** Undesirable, prioritize action (NIST SP 800-30 compliance recommended).
    -   **Critical (19–25):** Intolerable, immediate executive action required.

## Heatmap Explanation
The core visualization is a 5x5 Risk Matrix adhering to standard GRC practices (ISO 31000/NIST).
-   **Y-Axis:** Likelihood (1-5)
-   **X-Axis:** Impact (1-5)
-   **Cells:** Display the count of risks in each intersection.
-   **Colors:** Green (Low), Yellow (Medium), Orange (High), Red (Critical).
-   **Interaction:** Hover over cells to see the specific assets contributing to that risk cluster.

## GRC & NIST Context
This dashboard embeds GRC hints specifically for higher-level risks.
-   **High Risks** trigger a hint to "Prioritize per NIST SP 800-30", guiding users to follow formal risk assessment procedures.
-   **Critical Risks** escalate to "Immediate executive action", aligning with standard incident response protocols.

## Assumptions & Edge Cases
-   **Data Persistence:** Uses SQLite (`risks.db`) for lightweight, serverless persistence.
-   **Validation:** Inputs are strictly validated (1-5 integers); API returns 400 Bad Request on violation.
-   **Edge Cases Tested:**
    -   Zero risks (Empty state handled cleanly).
    -   Maximum score (25) correctly maps to Critical/Red.
    -   Filtering returns correct subsets.
    -   Duplicate risks are allowed (as per requirements).

---
**Author:** Antigravity AI Agent
**Date:** 2026-02-06
