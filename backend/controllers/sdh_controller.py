from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.sdh_models import SdhDevInfo, SdhDevConfig, SdhDevState
from schemas.sdh_schemas import SdhDevInfoSchema, SdhDevConfigSchema, SdhDevStateSchema

# Crear un registro en sdh_dev_info
def create_sdh_dev_info(db: Session, sdh_dev_info: SdhDevInfoSchema):
    db_sdh_info = SdhDevInfo(**sdh_dev_info.dict())
    db.add(db_sdh_info)
    db.commit()
    db.refresh(db_sdh_info)
    return db_sdh_info

# Obtener un registro de sdh_dev_info por SN
def get_sdh_dev_info(db: Session, sn: str):
    db_sdh_info = db.query(SdhDevInfo).filter(SdhDevInfo.sn == sn).first()
    if not db_sdh_info:
        raise HTTPException(status_code=404, detail="SDH device info not found")
    return db_sdh_info

# Crear un registro en sdh_dev_config
def create_sdh_dev_config(db: Session, sdh_dev_config: SdhDevConfigSchema):
    db_sdh_config = SdhDevConfig(**sdh_dev_config.dict())
    db.add(db_sdh_config)
    db.commit()
    db.refresh(db_sdh_config)
    return db_sdh_config

# Obtener un registro de sdh_dev_config por SN
def get_sdh_dev_config(db: Session, sn: str):
    db_sdh_config = db.query(SdhDevConfig).filter(SdhDevConfig.sn == sn).first()
    if not db_sdh_config:
        raise HTTPException(status_code=404, detail="SDH device config not found")
    return db_sdh_config

# Crear un registro en sdh_dev_state
def create_sdh_dev_state(db: Session, sdh_dev_state: SdhDevStateSchema):
    db_sdh_state = SdhDevState(**sdh_dev_state.dict())
    db.add(db_sdh_state)
    db.commit()
    db.refresh(db_sdh_state)
    return db_sdh_state

# Obtener un registro de sdh_dev_state por SN
def get_sdh_dev_state(db: Session, sn: str):
    db_sdh_state = db.query(SdhDevState).filter(SdhDevState.sn == sn).first()
    if not db_sdh_state:
        raise HTTPException(status_code=404, detail="SDH device state not found")
    return db_sdh_state


# Obtener todos los registros de sdh_dev_info
def get_all_sdh_dev_info(db: Session):
    return db.query(SdhDevInfo).all()