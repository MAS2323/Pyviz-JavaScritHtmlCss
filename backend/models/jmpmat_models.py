from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class JmpMat(Base):
    __tablename__ = "jmpmat"
    id = Column(Integer, primary_key=True, autoincrement=True)
    gId = Column(Integer, ForeignKey("control_frames.gId"), nullable=False)
    actNum = Column(Integer)
    maxPorts = Column(Integer)
    actMap = Column(String(255))
    sdh_sn = Column(String(50), ForeignKey("sdh_dev_info.sn"), nullable=False)
    iolp_sn = Column(String(50), ForeignKey("iolp_dev_info.sn"), nullable=False)
    sn = Column(String(50), ForeignKey("device_info.sn"), nullable=False)
    sdh_dev_info = relationship("SdhDevInfo", back_populates="jmpmat")
    iolp_dev_info = relationship("IolpDevInfo", back_populates="jmpmat")
    device_info = relationship("DeviceInfo", back_populates="jmpmat")