from pydantic import BaseModel
from typing import Optional

class TraffstubDevInfoSchema(BaseModel):
    sn: str
    tagId: Optional[str] = None
    Type: Optional[str] = None
    device_info: Optional[str] = None
    class Config:
        from_attributes = True

class TraffstubDevConfigSchema(BaseModel):
    sn: str
    txer_Id: Optional[int] = None
    txer_destaddr: Optional[str] = None
    txer_pkgrate: Optional[int] = None
    rxer_Id: Optional[int] = None
    rxer_srcaddr: Optional[str] = None
    rxer_pkgrate: Optional[int] = None
    class Config:
        from_attributes = True

class TraffstubDevStateSchema(BaseModel):
    sn: str
    recordId: int
    health_point: Optional[int] = None
    warnings: Optional[str] = None
    crisis: Optional[str] = None
    warnlog_url: Optional[str] = None
    crislog_url: Optional[str] = None
    rawfile_url: Optional[str] = None

    class Config:
        from_attributes = True