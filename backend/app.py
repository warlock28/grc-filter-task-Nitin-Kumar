import logging
import sqlite3
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from database import init_db, get_db
from models import RiskInput, RiskResponse
from logic import calculate_risk, get_compliance_hint

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="GRC Risk Assessment API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event() -> None:
    try:
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise

@app.get("/", tags=["Health Check"])
def read_root():
    return {"message": "GRC Risk Assessment API is running", "status": "ok"}

@app.post("/assess-risk", response_model=RiskResponse, tags=["Risk Management"])
def assess_risk(
    risk_in: RiskInput, 
    conn: sqlite3.Connection = Depends(get_db)
) -> RiskResponse:
    try:
        score, level = calculate_risk(risk_in.likelihood, risk_in.impact)
        
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO risks (asset, threat, likelihood, impact, score, level) VALUES (?, ?, ?, ?, ?, ?)",
            (risk_in.asset, risk_in.threat, risk_in.likelihood, risk_in.impact, score, level)
        )
        conn.commit()
        new_id = cursor.lastrowid
        
        compliance = get_compliance_hint(level)
        
        logger.info(f"Risk created: ID={new_id}, Level={level}")
        
        return RiskResponse(
            id=new_id,
            asset=risk_in.asset,
            threat=risk_in.threat,
            likelihood=risk_in.likelihood,
            impact=risk_in.impact,
            score=score,
            level=level,
            compliance_hint=compliance
        )
    except sqlite3.Error as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Database operation failed")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/risks", response_model=List[RiskResponse], tags=["Risk Management"])
def get_risks(
    level: Optional[str] = Query(None),
    conn: sqlite3.Connection = Depends(get_db)
) -> List[RiskResponse]:
    try:
        cursor = conn.cursor()
        
        if level:
            cursor.execute("SELECT * FROM risks WHERE level = ?", (level,))
        else:
            cursor.execute("SELECT * FROM risks")
            
        rows = cursor.fetchall()
        
        results = []
        for row in rows:
            r_level = row["level"]
            compliance = get_compliance_hint(r_level)
            results.append(RiskResponse(
                id=row["id"],
                asset=row["asset"],
                threat=row["threat"],
                likelihood=row["likelihood"],
                impact=row["impact"],
                score=row["score"],
                level=r_level,
                compliance_hint=compliance
            ))
        return results
    except Exception as e:
        logger.error(f"Error fetching risks: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch risks")
