from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class DeviceInfo(Base):
    __tablename__ = "device_info"
    sn = Column(String(50), primary_key=True)
    gId = Column(Integer, ForeignKey("control_frames.gId"), nullable=False)
    name = Column(String(100))
    city = Column(String(100))
    location = Column(String(255))
    longitude = Column(Float)
    lattitude = Column(Float)
    Producer = Column(String(100))
    traffstub_dev_info = relationship("TraffstubDevInfo", back_populates="device_info")
    sdh_dev_info = relationship("SdhDevInfo", back_populates="device_info")
    iolp_dev_info = relationship("IolpDevInfo", back_populates="device_info")
    fibcab_source = relationship(
        "FibcabDevInfo",
        foreign_keys="FibcabDevInfo.source_sn",
        back_populates="source_node"
    )
    fibcab_target = relationship(
        "FibcabDevInfo",
        foreign_keys="FibcabDevInfo.target_sn",
        back_populates="target_node"
    )
    jmpmat = relationship("JmpMat", back_populates="device_info", uselist=False)