from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.traffstub_models import TraffstubDevInfo, TraffstubDevConfig, TraffstubDevState
from schemas.traffstub_schemas import TraffstubDevInfoSchema, TraffstubDevConfigSchema, TraffstubDevStateSchema

# Crear un registro en traffstub_dev_info
def create_traffstub_dev_info(db: Session, traffstub_dev_info: TraffstubDevInfoSchema):
    db_traffstub_info = TraffstubDevInfo(**traffstub_dev_info.dict())
    db.add(db_traffstub_info)
    db.commit()
    db.refresh(db_traffstub_info)
    return db_traffstub_info

# Obtener un registro de traffstub_dev_info por SN
def get_traffstub_dev_info(db: Session, sn: str):
    db_traffstub_info = db.query(TraffstubDevInfo).filter(TraffstubDevInfo.sn == sn).first()
    if not db_traffstub_info:
        raise HTTPException(status_code=404, detail="TRAFFSTUB device info not found")
    return db_traffstub_info

# Crear un registro en traffstub_dev_config
def create_traffstub_dev_config(db: Session, traffstub_dev_config: TraffstubDevConfigSchema):
    db_traffstub_config = TraffstubDevConfig(**traffstub_dev_config.dict())
    db.add(db_traffstub_config)
    db.commit()
    db.refresh(db_traffstub_config)
    return db_traffstub_config

# Obtener un registro de traffstub_dev_config por SN
def get_traffstub_dev_config(db: Session, sn: str):
    db_traffstub_config = db.query(TraffstubDevConfig).filter(TraffstubDevConfig.sn == sn).first()
    if not db_traffstub_config:
        raise HTTPException(status_code=404, detail="TRAFFSTUB device config not found")
    return db_traffstub_config

# Crear un registro en traffstub_dev_state
def create_traffstub_dev_state(db: Session, traffstub_dev_state: TraffstubDevStateSchema):
    db_traffstub_state = TraffstubDevState(**traffstub_dev_state.dict())
    db.add(db_traffstub_state)
    db.commit()
    db.refresh(db_traffstub_state)
    return db_traffstub_state

# Obtener un registro de traffstub_dev_state por SN
def get_traffstub_dev_state(db: Session, sn: str):
    db_traffstub_state = db.query(TraffstubDevState).filter(TraffstubDevState.sn == sn).first()
    if not db_traffstub_state:
        raise HTTPException(status_code=404, detail="TRAFFSTUB device state not found")
    return db_traffstub_state


# Obtener todos los registros de traffstub_dev_info
def get_all_traffstub_dev_info(db: Session):
    return db.query(TraffstubDevInfo).all()