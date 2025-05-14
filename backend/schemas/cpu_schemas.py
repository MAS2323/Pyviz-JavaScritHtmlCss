# schemas/cpu_schemas.py
from pydantic import BaseModel
from typing import List, Optional

class CPUMeasurementResponse(BaseModel):
    task_result: dict
    cpu_usage: List[float]
    max_cpu_usage: float
    avg_cpu_usage: float
    cpu_usage_plot: Optional[str] = None  # Base64 image