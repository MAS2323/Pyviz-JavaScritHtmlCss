from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# sn = serial nnumber of the device
class SdhDevInfo(Base):
    __tablename__ = "sdh_dev_info"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    gId = Column(Integer, ForeignKey("control_frames.gId"), nullable=False)  # Added gId
    tagId = Column(String(50))
    Type = Column(String(50))
    device_info = relationship("DeviceInfo", back_populates="sdh_dev_info")
    jmpmat = relationship("JmpMat", back_populates="sdh_dev_info", uselist=False)
    
class SdhDevConfig(Base):
    __tablename__ = "sdh_dev_config"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    opt1_dir_name = Column(String(100))
    opt1_dir_gId = Column(Integer)  # Clarify if this needs ForeignKey
    opt1_trans_type = Column(String(50))
    opt1_traffic = Column(String(50))
    opt2_dir_name = Column(String(100))
    opt2_dir_gId = Column(Integer)  # Clarify if this needs ForeignKey
    opt2_trans_type = Column(String(50))
    opt2_traffic = Column(String(50))
    
class SdhDevState(Base):
    __tablename__ = "sdh_dev_state"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    recordId = Column(Integer, nullable=False)
    health_point = Column(Integer)
    warnings = Column(String(255))
    crisis = Column(String(255))
    warnlog_url = Column(String(255))
    crislog_url = Column(String(255))
    rawfile_url = Column(String(255))