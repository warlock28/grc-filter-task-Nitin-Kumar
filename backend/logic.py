from typing import Tuple, Optional

RISK_LEVELS = {
    (0, 5): "Low",
    (6, 12): "Medium",
    (13, 18): "High",
    (19, 25): "Critical"
}

COMPLIANCE_HINTS = {
    "High": "Prioritize per NIST SP 800-30",
    "Critical": "Immediate executive action required"
}

def calculate_risk(likelihood: int, impact: int) -> Tuple[int, str]:
    score = likelihood * impact
    
    for (min_score, max_score), level in RISK_LEVELS.items():
        if min_score <= score <= max_score:
            return score, level
    
    return score, "Unknown"

def get_compliance_hint(level: str) -> Optional[str]:
    return COMPLIANCE_HINTS.get(level)
