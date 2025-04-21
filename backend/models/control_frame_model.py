from sqlalchemy import Column, Integer, LargeBinary, DateTime
from sqlalchemy.sql import func
from database import Base

class ControlFrame(Base):
    __tablename__ = "control_frames"

    id = Column(Integer, primary_key=True, index=True)
    cmdFlg = Column(Integer, nullable=False)
    gId = Column(Integer, nullable=False)
    param = Column(Integer, nullable=False)
    length = Column(Integer, nullable=False)
    values = Column(LargeBinary, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())