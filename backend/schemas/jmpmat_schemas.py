from pydantic import BaseModel
from typing import Optional

class JmpMatSchema(BaseModel):
    gId: int
    actNum: Optional[int] = None
    maxPorts: Optional[int] = None
    actMap: Optional[str] = None
    iolp_sn: str  # SN del dispositivo IOLP conectado
    sdh_sn: str   # SN del dispositivo SDH conectado
    iolp: Optional[int] = None
    sdh: Optional[int] = None
    device_info: Optional[str] = None
    # sn: Optional[str] = None
    
    class Config:
        from_attributes = True