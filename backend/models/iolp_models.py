from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class IolpDevInfo(Base):
    __tablename__ = "iolp_dev_info"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    gId = Column(Integer, ForeignKey("control_frames.gId"), nullable=False)
    tagId = Column(String(50), nullable=False)
    Type = Column(String(50), nullable=False)
    device_info = relationship("DeviceInfo", back_populates="iolp_dev_info")
    jmpmat = relationship("JmpMat", back_populates="iolp_dev_info")

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
    recordId = Column(Integer, primary_key=True)
    health_point = Column(Integer, nullable=False)
    warnings = Column(String(255), nullable=True)
    crisis = Column(String(255), nullable=True)
    warnlog_url = Column(String(255), nullable=True)
    crislog_url = Column(String(255), nullable=True)
    rawfile_url = Column(String(255), nullable=True)
    opt_pow_mean = Column(Float, nullable=False)
    opt_pow_var = Column(Float, nullable=False)
    opt_pow_max = Column(Float, nullable=False)
    opt_pow_min = Column(Float, nullable=False)
    device_info = relationship("DeviceInfo", back_populates="iolp_state")