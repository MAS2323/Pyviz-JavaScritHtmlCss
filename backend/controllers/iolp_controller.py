from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.iolp_models import IolpDevInfo, IolpDevConfig, IolpDevState
from schemas.iolp_schemas import IolpDevInfoSchema, IolpDevConfigSchema, IolpDevStateSchema

# Crear un registro en iolp_dev_info
def create_iolp_dev_info(db: Session, iolp_dev_info: IolpDevInfoSchema):
    db_iolp_info = IolpDevInfo(**iolp_dev_info.dict())
    db.add(db_iolp_info)
    db.commit()
    db.refresh(db_iolp_info)
    return db_iolp_info

# Obtener un registro de iolp_dev_info por SN
def get_iolp_dev_info(db: Session, sn: str):
    db_iolp_info = db.query(IolpDevInfo).filter(IolpDevInfo.sn == sn).first()
    if not db_iolp_info:
        raise HTTPException(status_code=404, detail="IOLP device info not found")
    return db_iolp_info

# Crear un registro en iolp_dev_config
def create_iolp_dev_config(db: Session, iolp_dev_config: IolpDevConfigSchema):
    db_iolp_config = IolpDevConfig(**iolp_dev_config.dict())
    db.add(db_iolp_config)
    db.commit()
    db.refresh(db_iolp_config)
    return db_iolp_config

# Obtener un registro de iolp_dev_config por SN
def get_iolp_dev_config(db: Session, sn: str):
    db_iolp_config = db.query(IolpDevConfig).filter(IolpDevConfig.sn == sn).first()
    if not db_iolp_config:
        raise HTTPException(status_code=404, detail="IOLP device config not found")
    return db_iolp_config

# Crear un registro en iolp_dev_state
def create_iolp_dev_state(db: Session, iolp_dev_state: IolpDevStateSchema):
    db_iolp_state = IolpDevState(**iolp_dev_state.dict())
    db.add(db_iolp_state)
    db.commit()
    db.refresh(db_iolp_state)
    return db_iolp_state

# Obtener un registro de iolp_dev_state por SN
def get_iolp_dev_state(db: Session, sn: str):
    db_iolp_state = db.query(IolpDevState).filter(IolpDevState.sn == sn).first()
    if not db_iolp_state:
        raise HTTPException(status_code=404, detail="IOLP device state not found")
    return db_iolp_state