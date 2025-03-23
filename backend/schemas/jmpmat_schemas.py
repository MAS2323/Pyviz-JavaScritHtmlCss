from pydantic import BaseModel
from typing import Optional

class JmpMatSchema(BaseModel):
    gId: int
    actNum: Optional[int] = None
    maxPorts: Optional[int] = None
    actMap: Optional[str] = None
    fibcab_sn: str  # SN del dispositivo Fibcab conectado
    sdh_sn: str     # SN del dispositivo SDH conectado
    fibcab: Optional[int] = None
    sdh: Optional[int] = None
    device_info: Optional[str] = None
    sn: Optional[str] = None
    class Config:
        from_attributes = True