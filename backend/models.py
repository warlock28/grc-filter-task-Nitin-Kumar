from typing import Optional
from pydantic import BaseModel, Field

class RiskInput(BaseModel):
    asset: str = Field(..., min_length=1, max_length=200)
    threat: str = Field(..., min_length=1, max_length=200)
    likelihood: int = Field(..., ge=1, le=5)
    impact: int = Field(..., ge=1, le=5)

class RiskResponse(BaseModel):
    id: int
    asset: str
    threat: str
    likelihood: int
    impact: int
    score: int
    level: str
    compliance_hint: Optional[str] = None
