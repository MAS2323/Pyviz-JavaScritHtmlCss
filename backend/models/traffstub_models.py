from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from database import Base

class TraffstubDevInfo(Base):
    __tablename__ = "traffstub_dev_info"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    tagId = Column(String(50))
    Type = Column(String(50))

    device_info = relationship("DeviceInfo", back_populates="traffstub_dev_info")

class TraffstubDevConfig(Base):
    __tablename__ = "traffstub_dev_config"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    txer_Id = Column(String(50), primary_key=True)
    txer_destaddr = Column(String(50))
    txer_pkgrate = Column(String(50))
    rxer_Id = Column(String(50), primary_key=True)
    rxer_srcaddr = Column(String(50))
    rxer_pkgrate = Column(String(50
    ))

class TraffstubDevState(Base):
    __tablename__ = "traffstub_dev_state"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    recordId = Column(Integer, nullable=False)
    health_point = Column(Integer)
    warnings = Column(String(255))
    crisis = Column(String(255))
    warnlog_url = Column(String(255))
    crislog_url = Column(String(255))
    rawfile_url = Column(String(255))
    # En tu modelo TraffstubDevState
    timestamp = Column(DateTime, default=datetime.utcnow)