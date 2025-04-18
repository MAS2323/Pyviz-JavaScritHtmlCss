from pydantic import BaseModel
from typing import Optional

class FibcabDevInfoSchema(BaseModel):
    sn: str
    gId: Optional[int] = None
    tagId: Optional[str] = None
    Type: Optional[str] = None
    source_sn: Optional[str] = None
    target_sn: Optional[str] = None
    source_city: Optional[str] = None
    target_city: Optional[str] = None
    name: Optional[str] = None
    total_fiber_number: Optional[int] = None
    connected_fiber_number: Optional[int] = None
    connected_array: Optional[str] = None
    suspended_fiber_number: Optional[int] = None
    suspended_array: Optional[str] = None
    cable_temp: Optional[float] = None

    class Config:
        from_attributes = True

class FibcabDevConfigSchema(BaseModel):
    sn: str
    ficab_capacity: Optional[int] = None
    opt1_active_fc_map: Optional[str] = None
    opt1_inactive_fic_map: Optional[str] = None
    opt2_fibcab_perfrmace: Optional[str] = None
    opt2_fiber_attnuetion_coeff: Optional[float] = None
    opt3_connector_loss: Optional[float] = None
    opt3_splice_loss: Optional[float] = None
    opt_fibr_tem_state: Optional[str] = None

    class Config:
        from_attributes = True

class FibcabDevStateSchema(BaseModel):
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