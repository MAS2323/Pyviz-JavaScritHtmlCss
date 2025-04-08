from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class JmpMat(Base):
    __tablename__ = "jmpmat"

    gId = Column(Integer, primary_key=True)
    actNum = Column(Integer)
    maxPorts = Column(Integer)
    actMap = Column(String(255))

    # Relación con sdh_dev_info
    sdh_sn = Column(String(50), ForeignKey("sdh_dev_info.sn"), nullable=False)
    sdh = relationship("SdhDevInfo", back_populates="jmpmat")

    # Relación con iolp_dev_info
    iolp_sn = Column(String(50), ForeignKey("iolp_dev_info.sn"), nullable=False)
    iolp = relationship("IolpDevInfo", back_populates="jmpmat")

    # Clave foránea hacia device_info
    sn = Column(String(50), ForeignKey("device_info.sn"), nullable=False)

    # Relación inversa con DeviceInfo
    device_info = relationship(
        "DeviceInfo",
        back_populates="jmpmat"
    )