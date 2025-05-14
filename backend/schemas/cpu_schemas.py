from pydantic import BaseModel
from typing import List, Dict, Any

class CPUMeasurementResponse(BaseModel):
    task_result: Dict[str, Any]
    cpu_usage: List[float]
    max_cpu_usage: float
    avg_cpu_usage: float
    cpu_usage_plot: str

    class Config:
        from_attributes = True  # Updated from orm_mode