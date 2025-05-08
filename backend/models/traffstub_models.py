from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class TraffstubDevInfo(Base):
    __tablename__ = "traffstub_dev_info"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    gId = Column(Integer, ForeignKey("control_frames.gId"), nullable=False)
    tagId = Column(String(50), nullable=False)
    Type = Column(String(50), nullable=False)
    device_info = relationship("DeviceInfo", back_populates="traffstub_dev_info")

class TraffstubDevConfig(Base):
    __tablename__ = "traffstub_dev_config"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    txer_Id = Column(String(50), nullable=False)
    txer_destaddr = Column(String(50), nullable=False)
    txer_pkgrate = Column(String(50), nullable=False)
    rxer_Id = Column(String(50), nullable=False)
    rxer_srcaddr = Column(String(50), nullable=False)
    rxer_pkgrate = Column(String(50), nullable=False)
    device_info = relationship("DeviceInfo", back_populates="traffstub_config")

class TraffstubDevState(Base):
    __tablename__ = "traffstub_dev_state"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    recordId = Column(Integer, primary_key=True)
    health_point = Column(Integer, nullable=False)
    warnings = Column(String(255), nullable=True)
    crisis = Column(String(255), nullable=True)
    warnlog_url = Column(String(255), nullable=True)
    crislog_url = Column(String(255), nullable=True)
    rawfile_url = Column(String(255), nullable=True)
    timestamp = Column(DateTime, nullable=False, server_default=func.now())
    device_info = relationship("DeviceInfo", back_populates="traffstub_state")