from pydantic import BaseModel
from typing import Optional

class SdhDevInfoSchema(BaseModel):
    sn: str
    tagId: Optional[str] = None
    Type: Optional[str] = None
    device_info: Optional[str] = None
    jmpmat: Optional[int] = None
    class Config:
        from_attributes = True

class SdhDevConfigSchema(BaseModel):
    sn: str
    opt1_dir_name: Optional[str] = None
    opt1_dir_gId: Optional[int] = None
    opt1_trans_type: Optional[str] = None
    opt1_traffic: Optional[str] = None
    opt2_dir_name: Optional[str] = None
    opt2_dir_gId: Optional[int] = None
    opt2_trans_type: Optional[str] = None
    opt2_traffic: Optional[str] = None

    class Config:
        from_attributes = True

class SdhDevStateSchema(BaseModel):
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