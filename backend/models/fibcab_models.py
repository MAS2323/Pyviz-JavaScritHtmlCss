from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class FibcabDevInfo(Base):
    __tablename__ = "fibcab_dev_info"
    sn = Column(String(50), primary_key=True)
    gId = Column(Integer, ForeignKey("control_frames.gId"), nullable=False)
    tagId = Column(String(50), nullable=False)
    Type = Column(String(50), nullable=False)
    name = Column(String(100), nullable=False)
    total_fiber_number = Column(Integer, nullable=False)
    connected_fiber_number = Column(Integer, nullable=False)
    connected_array = Column(String(255), nullable=False)
    suspended_fiber_number = Column(Integer, nullable=False)
    suspended_array = Column(String(255), nullable=True)
    cable_temp = Column(Float, nullable=False)
    source_sn = Column(String(50), ForeignKey("device_info.sn"), nullable=False)
    target_sn = Column(String(50), ForeignKey("device_info.sn"), nullable=False)
    source_node = relationship("DeviceInfo", foreign_keys=[source_sn], back_populates="fibcab_source")
    target_node = relationship("DeviceInfo", foreign_keys=[target_sn], back_populates="fibcab_target")
    config = relationship("FibcabDevConfig", back_populates="fibcab_dev_info", uselist=False)
    state = relationship("FibcabDevState", back_populates="fibcab_dev_info")

class FibcabDevConfig(Base):
    __tablename__ = "fibcab_dev_config"
    sn = Column(String(50), ForeignKey("fibcab_dev_info.sn"), primary_key=True)
    ficab_capacity = Column(Integer, nullable=False)
    opt1_active_fc_map = Column(String(50), nullable=True)
    opt1_inactive_fic_map = Column(String(50), nullable=True)
    opt2_fibcab_perfrmace = Column(String(50), nullable=False)
    opt2_fiber_attnuetion_coeff = Column(Float, nullable=False)
    opt3_connector_loss = Column(Float, nullable=False)
    opt3_splice_loss = Column(Float, nullable=False)
    opt_fibr_tem_state = Column(String(50), nullable=False)
    fibcab_dev_info = relationship("FibcabDevInfo", back_populates="config")

class FibcabDevState(Base):
    __tablename__ = "fibcab_dev_state"
    sn = Column(String(50), ForeignKey("fibcab_dev_info.sn"), primary_key=True)
    recordId = Column(Integer, primary_key=True)
    health_point = Column(Integer, nullable=False)
    warnings = Column(String(255), nullable=True)
    crisis = Column(String(255), nullable=True)
    warnlog_url = Column(String(255), nullable=True)
    crislog_url = Column(String(255), nullable=True)
    rawfile_url = Column(String(255), nullable=True)
    fibcab_dev_info = relationship("FibcabDevInfo", back_populates="state")