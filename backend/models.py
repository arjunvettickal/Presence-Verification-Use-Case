from pydantic import BaseModel
from typing import Dict, List, Optional

class OrderRequest(BaseModel):
    order_id: str
    parts: Dict[str, int]  # e.g., {"u_bracket": 1, "handle": 2}
    model_name: str

class DetectionResult(BaseModel):
    status: str  # Verified, Incomplete, Excess, Fail
    detected_counts: Dict[str, int]
    missing_parts: Dict[str, int]
    excess_parts: Dict[str, int]
    image_path: str
    log_id: str
