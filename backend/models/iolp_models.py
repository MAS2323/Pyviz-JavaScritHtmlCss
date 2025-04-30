from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class IolpDevInfo(Base):
    __tablename__ = "iolp_dev_info"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    gId = Column(Integer, ForeignKey("control_frames.gId"), nullable=False)  # Added gId
    tagId = Column(String(50))
    Type = Column(String(50))
    device_info = relationship("DeviceInfo", back_populates="iolp_dev_info")
    jmpmat = relationship("JmpMat", back_populates="iolp_dev_info", uselist=False)

class IolpDevConfig(Base):
    __tablename__ = "iolp_dev_config"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    switch_vec = Column(String(255))
    actived_pairs = Column(String(255))
    inactived_pairs = Column(String(255))
    in2dev_gId = Column(Integer)  # Clarify if this needs ForeignKey
    in2dev_connmap = Column(String(255))
    out2dev_gId = Column(Integer)  # Clarify if this needs ForeignKey
    out2dev_connmap = Column(String(255))
    thermsensor_id = Column(String(50))
    
class IolpDevState(Base):
    __tablename__ = "iolp_dev_state"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    recordId = Column(Integer, nullable=False)
    health_point = Column(Integer)
    warnings = Column(String(255))
    crisis = Column(String(255))
    warnlog_url = Column(String(255))
    crislog_url = Column(String(255))
    rawfile_url = Column(String(255))
    opt_pow_mean = Column(Float)
    opt_pow_var = Column(Float)
    opt_pow_max = Column(Float)
    opt_pow_min = Column(Float)