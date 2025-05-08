from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class DeviceInfo(Base):
    __tablename__ = "device_info"
    sn = Column(String(50), primary_key=True)
    gId = Column(Integer, ForeignKey("control_frames.gId"), nullable=False)
    name = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    location = Column(String(255), nullable=False)
    longitude = Column(Float, nullable=False)
    lattitude = Column(Float, nullable=False)
    Producer = Column(String(100), nullable=False)
    sdh_dev_info = relationship("SdhDevInfo", back_populates="device_info", uselist=False)
    traffstub_dev_info = relationship("TraffstubDevInfo", back_populates="device_info", uselist=False)
    iolp_dev_info = relationship("IolpDevInfo", back_populates="device_info", uselist=False)
    iolp_state = relationship("IolpDevState", back_populates="device_info")
    sdh_state = relationship("SdhDevState", back_populates="device_info")
    traffstub_state = relationship("TraffstubDevState", back_populates="device_info")
    fibcab_source = relationship("FibcabDevInfo", back_populates="source_node", foreign_keys="FibcabDevInfo.source_sn")
    fibcab_target = relationship("FibcabDevInfo", back_populates="target_node", foreign_keys="FibcabDevInfo.target_sn")
    sdh_config = relationship("SdhDevConfig", back_populates="device_info", uselist=False)
    traffstub_config = relationship("TraffstubDevConfig", back_populates="device_info", uselist=False)
    jmpmat = relationship("JmpMat", back_populates="device_info")
