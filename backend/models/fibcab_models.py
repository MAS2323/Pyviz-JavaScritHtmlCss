from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class FibcabDevInfo(Base):
    __tablename__ = "fibcab_dev_info"

    sn = Column(String(50), primary_key=True)
    gId = Column(Integer)
    tagId = Column(String(50))
    Type = Column(String(50))
    name = Column(String(100))
    total_fiber_number = Column(Integer)
    connected_fiber_number = Column(Integer)
    connected_array = Column(String(255))
    suspended_fiber_number = Column(Integer)
    suspended_array = Column(String(255))
    cable_temp = Column(Float)

    # Foreign keys and relationships (existing ones)
    source_sn = Column(String(50), ForeignKey("device_info.sn"))
    target_sn = Column(String(50), ForeignKey("device_info.sn"))

    source_node = relationship(
        "DeviceInfo",
        foreign_keys=[source_sn],
        back_populates="fibcab_source"
    )
    target_node = relationship(
        "DeviceInfo",
        foreign_keys=[target_sn],
        back_populates="fibcab_target"
    )

    config = relationship(
        "FibcabDevConfig",
        back_populates="fibcab_dev_info",
        uselist=False
    )
    state = relationship(
        "FibcabDevState",
        back_populates="fibcab_dev_info",
        uselist=False
    )
    
class FibcabDevConfig(Base):
    __tablename__ = "fibcab_dev_config"
    
    sn = Column(String(50), ForeignKey("fibcab_dev_info.sn"), primary_key=True)  # Cambio aquí
    ficab_capacity = Column(Integer)
    opt1_active_fc_map = Column(String(50))
    opt1_inactive_fic_map = Column(String(50))
    opt2_fibcab_perfrmace = Column(String(50))
    opt2_fiber_attnuetion_coeff = Column(Float)
    opt3_connector_loss = Column(Float)
    opt3_splice_loss = Column(Float)
    opt_fibr_tem_state = Column(String(50))

    # Relación inversa con FibcabDevInfo
    fibcab_dev_info = relationship(
        "FibcabDevInfo",
        back_populates="config"
    )
    
class FibcabDevState(Base):
    __tablename__ = "fibcab_dev_state"
    
    sn = Column(String(50), ForeignKey("fibcab_dev_info.sn"), primary_key=True)  # Cambio aquí
    recordId = Column(Integer, nullable=False)
    health_point = Column(Integer)
    warnings = Column(String(255))
    crisis = Column(String(255))
    warnlog_url = Column(String(255))
    crislog_url = Column(String(255))
    rawfile_url = Column(String(255))

    # Relación inversa con FibcabDevInfo    
    fibcab_dev_info = relationship(
        "FibcabDevInfo",
        back_populates="state"
    )