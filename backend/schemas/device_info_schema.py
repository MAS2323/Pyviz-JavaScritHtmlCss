from pydantic import BaseModel
from typing import Optional

class DeviceInfoSchema(BaseModel):
    sn: str
    gId: int
    name: Optional[str] = None
    city: Optional[str] = None
    location: Optional[str] = None
    longitude: Optional[float] = None
    lattitude: Optional[float] = None
    Producer: Optional[str] = None
    traffstub_dev_info: Optional[str] = None
    sdh_dev_info: Optional[str] = None
    iolp_dev_info: Optional[str] = None
    fibcab_source: Optional[str] = None
    fibcab_target: Optional[str] = None
    jmpmat: Optional[str] = None
    class Config:
        from_attributes = True