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
    sdh_sn = Column(String(50), ForeignKey("sdh_dev_info.sn"), nullable=False)  # Clave foránea hacia sdh
    sdh = relationship("SdhDevInfo", back_populates="jmpmat")  # Relación inversa con sdh_dev_info

    # Relación con fibcab_dev_info
    fibcab_sn = Column(String(50), ForeignKey("fibcab_dev_info.sn"), nullable=False)  # Clave foránea hacia fibcab
    fibcab = relationship("FibcabDevInfo", back_populates="jmpmat")  # Relación inversa con fibcab_dev_info

    # Clave foránea hacia device_info
    sn = Column(String(50), ForeignKey("device_info.sn"), nullable=False)

    # Relación inversa con DeviceInfo
    device_info = relationship(
        "DeviceInfo",
        back_populates="jmpmat"
    )