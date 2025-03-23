from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class FibcabDevInfo(Base):
    __tablename__ = "fibcab_dev_info"

    sn = Column(String(50), primary_key=True)  # Clave primaria
    gId = Column(Integer)
    tagId = Column(String(50))
    Type = Column(String(50))

    # Claves foráneas hacia device_info
    source_sn = Column(String(50), ForeignKey("device_info.sn"))  # Nodo de origen
    target_sn = Column(String(50), ForeignKey("device_info.sn"))  # Nodo de destino

    # Relaciones con device_info
    source_node = relationship(
        "DeviceInfo",
        foreign_keys=[source_sn],  # Especificar la clave foránea
        back_populates="fibcab_source"
    )
    target_node = relationship(
        "DeviceInfo",
        foreign_keys=[target_sn],  # Especificar la clave foránea
        back_populates="fibcab_target"
    )

    # Relación inversa con JmpMat
    jmpmat = relationship(
        "JmpMat",
        back_populates="fibcab",
        uselist=False  # Indica que es una relación uno a uno
    )
    
    
class FibcabDevConfig(Base):
    __tablename__ = "fibcab_dev_config"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    ficab_capacity = Column(Integer)
    opt1_active_fc_map = Column(String(50))
    opt1_inactive_fic_map = Column(String(50))
    opt2_fibcab_perfrmace = Column(String(50))
    opt2_fiber_attnuetion_coeff = Column(Float)
    opt3_connector_loss = Column(Float)
    opt3_splice_loss = Column(Float)
    opt_fibr_tem_state = Column(String(50))
    
class FibcabDevState(Base):
    __tablename__ = "fibcab_dev_state"
    sn = Column(String(50), ForeignKey("device_info.sn"), primary_key=True)
    recordId = Column(Integer, nullable=False)
    health_point = Column(Integer)
    warnings = Column(String(255))
    crisis = Column(String(255))
    warnlog_url = Column(String(255))
    crislog_url = Column(String(255))
    rawfile_url = Column(String(255))