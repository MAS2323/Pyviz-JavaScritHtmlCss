from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.fibcab_models import FibcabDevInfo, FibcabDevConfig, FibcabDevState
from schemas.fibcab_schemas import FibcabDevInfoSchema, FibcabDevConfigSchema, FibcabDevStateSchema

# Crear un registro en fibcab_dev_info
def create_fibcab_dev_info(db: Session, fibcab_dev_info: FibcabDevInfoSchema):
    db_fibcab_info = FibcabDevInfo(**fibcab_dev_info.dict())
    db.add(db_fibcab_info)
    db.commit()
    db.refresh(db_fibcab_info)
    return db_fibcab_info

# Obtener un registro de fibcab_dev_info por SN
def get_fibcab_dev_info(db: Session, sn: str):
    db_fibcab_info = db.query(FibcabDevInfo).filter(FibcabDevInfo.sn == sn).first()
    if not db_fibcab_info:
        raise HTTPException(status_code=404, detail="FIBCAB device info not found")
    return db_fibcab_info

# Crear un registro en fibcab_dev_config
def create_fibcab_dev_config(db: Session, fibcab_dev_config: FibcabDevConfigSchema):
    db_fibcab_config = FibcabDevConfig(**fibcab_dev_config.dict())
    db.add(db_fibcab_config)
    db.commit()
    db.refresh(db_fibcab_config)
    return db_fibcab_config

# Obtener un registro de fibcab_dev_config por SN
def get_fibcab_dev_config(db: Session, sn: str):
    db_fibcab_config = db.query(FibcabDevConfig).filter(FibcabDevConfig.sn == sn).first()
    if not db_fibcab_config:
        raise HTTPException(status_code=404, detail="FIBCAB device config not found")
    return db_fibcab_config

# Crear un registro en fibcab_dev_state
def create_fibcab_dev_state(db: Session, fibcab_dev_state: FibcabDevStateSchema):
    db_fibcab_state = FibcabDevState(**fibcab_dev_state.dict())
    db.add(db_fibcab_state)
    db.commit()
    db.refresh(db_fibcab_state)
    return db_fibcab_state

# Obtener un registro de fibcab_dev_state por SN
def get_fibcab_dev_state(db: Session, sn: str):
    db_fibcab_state = db.query(FibcabDevState).filter(FibcabDevState.sn == sn).first()
    if not db_fibcab_state:
        raise HTTPException(status_code=404, detail="FIBCAB device state not found")
    return db_fibcab_state