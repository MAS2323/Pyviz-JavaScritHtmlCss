from pydantic import BaseModel
from typing import Optional

class IolpDevInfoSchema(BaseModel):
    sn: str
    tagId: Optional[str] = None
    Type: Optional[str] = None
    device_info: Optional[str] = None
    jmpmat: Optional[str] = None  # Relación inversa con JmpMat
    class Config:
        from_attributes = True  # Reemplaza orm_mode con from_attributes

class IolpDevConfigSchema(BaseModel):
    sn: str
    switch_vec: Optional[str] = None
    actived_pairs: Optional[str] = None
    inactived_pairs: Optional[str] = None
    in2dev_gId: Optional[int] = None
    in2dev_connmap: Optional[str] = None
    out2dev_gId: Optional[int] = None
    out2dev_connmap: Optional[str] = None
    thermsensor_id: Optional[str] = None

    class Config:
        from_attributes = True  # Reemplaza orm_mode con from_attributes

class IolpDevStateSchema(BaseModel):
    sn: str
    recordId: int
    health_point: Optional[int] = None
    warnings: Optional[str] = None
    crisis: Optional[str] = None
    warnlog_url: Optional[str] = None
    crislog_url: Optional[str] = None
    rawfile_url: Optional[str] = None
    opt_pow_mean: Optional[float] = None
    opt_pow_var: Optional[float] = None
    opt_pow_max: Optional[float] = None
    opt_pow_min: Optional[float] = None

    class Config:
        from_attributes = True  # Reemplaza orm_mode con from_attributes