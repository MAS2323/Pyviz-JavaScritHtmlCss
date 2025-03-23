from sqlalchemy import Column, String, Integer, Float
from sqlalchemy.orm import relationship
from database import Base

class DeviceInfo(Base):
    __tablename__ = "device_info"
    sn = Column(String(50), primary_key=True)  # Número de serie
    gId = Column(Integer, nullable=False)     # ID global
    name = Column(String(100))                # Nombre del dispositivo
    city = Column(String(100))                # Ciudad
    location = Column(String(255))            # Ubicación
    longitude = Column(Float)                 # Longitud
    lattitude = Column(Float)                 # Latitud
    Producer = Column(String(100))            # Productor
    
     # Relaciones inversas con los componentes específicos
    traffstub_dev_info = relationship("TraffstubDevInfo", back_populates="device_info")
    sdh_dev_info = relationship("SdhDevInfo", back_populates="device_info")
    iolp_dev_info = relationship("IolpDevInfo", back_populates="device_info")

   # # Relaciones inversas con fibcab_dev_info
    fibcab_source = relationship(
        "FibcabDevInfo",
        foreign_keys="FibcabDevInfo.source_sn",  # Especificar la clave foránea
        back_populates="source_node"
    )
    fibcab_target = relationship(
        "FibcabDevInfo",
        foreign_keys="FibcabDevInfo.target_sn",  # Especificar la clave foránea
        back_populates="target_node"
    )

    # Relación con jmpmat
    jmpmat = relationship(
        "JmpMat",
        back_populates="device_info",
        uselist=False  # Indica que es una relación uno a uno
    )