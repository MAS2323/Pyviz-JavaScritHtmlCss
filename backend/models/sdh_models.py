from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# sn = serial nnumber of the device
class SdhDevInfo(Base):
    __tablename__ = "sdh_dev_info"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    gId = Column(Integer, ForeignKey("control_frames.gId"), nullable=False)
    tagId = Column(String(50), nullable=False)
    Type = Column(String(50), nullable=False)
    device_info = relationship("DeviceInfo", back_populates="sdh_dev_info")
    jmpmat = relationship("JmpMat", back_populates="sdh_dev_info")

class SdhDevConfig(Base):
    __tablename__ = "sdh_dev_config"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    opt1_dir_name = Column(String(100), nullable=False)
    opt1_dir_gId = Column(Integer, nullable=False)
    opt1_trans_type = Column(String(50), nullable=False)
    opt1_traffic = Column(String(50), nullable=False)
    opt2_dir_name = Column(String(100), nullable=False)
    opt2_dir_gId = Column(Integer, nullable=False)
    opt2_trans_type = Column(String(50), nullable=False)
    opt2_traffic = Column(String(50), nullable=False)
    device_info = relationship("DeviceInfo", back_populates="sdh_config")

class SdhDevState(Base):
    __tablename__ = "sdh_dev_state"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    recordId = Column(Integer, primary_key=True)
    health_point = Column(Integer, nullable=False)
    warnings = Column(String(255), nullable=True)
    crisis = Column(String(255), nullable=True)
    warnlog_url = Column(String(255), nullable=True)
    crislog_url = Column(String(255), nullable=True)
    rawfile_url = Column(String(255), nullable=True)
    device_info = relationship("DeviceInfo", back_populates="sdh_state")
