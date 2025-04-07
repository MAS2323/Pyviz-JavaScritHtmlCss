from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from controllers.sdh_controller import (
    create_sdh_dev_info,
    get_sdh_dev_info,
    create_sdh_dev_config,
    get_sdh_dev_config,
    create_sdh_dev_state,
    get_sdh_dev_state,
    get_all_sdh_dev_info,
)
from schemas.sdh_schemas import (
    SdhDevInfoSchema,
    SdhDevConfigSchema,
    SdhDevStateSchema,
)
from database import get_db

sdh_router = APIRouter(prefix="/sdh", tags=["SDH"])

# Rutas para sdh_dev_info
@sdh_router.post("/dev-info/")
def create_sdh_dev(dev_info: SdhDevInfoSchema, db: Session = Depends(get_db)):
    return create_sdh_dev_info(db, dev_info)

@sdh_router.get("/dev-info/{sn}")
def read_sdh_dev(sn: str, db: Session = Depends(get_db)):
    return get_sdh_dev_info(db, sn)

# Rutas para sdh_dev_config
@sdh_router.post("/dev-config/")
def create_sdh_config(dev_config: SdhDevConfigSchema, db: Session = Depends(get_db)):
    return create_sdh_dev_config(db, dev_config)

@sdh_router.get("/dev-config/{sn}")
def read_sdh_config(sn: str, db: Session = Depends(get_db)):
    return get_sdh_dev_config(db, sn)

# Rutas para sdh_dev_state
@sdh_router.post("/dev-state/")
def create_sdh_state(dev_state: SdhDevStateSchema, db: Session = Depends(get_db)):
    return create_sdh_dev_state(db, dev_state)

@sdh_router.get("/dev-state/{sn}")
def read_sdh_state(sn: str, db: Session = Depends(get_db)):
    return get_sdh_dev_state(db, sn)


@sdh_router.get("/dev-info/")
def read_all_sdh_devs(db: Session = Depends(get_db)):
    return get_all_sdh_dev_info(db)