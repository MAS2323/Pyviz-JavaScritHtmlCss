from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from controllers.iolp_controller import (
    create_iolp_dev_info,
    get_iolp_dev_info,
    create_iolp_dev_config,
    get_iolp_dev_config,
    create_iolp_dev_state,
    get_iolp_dev_state,
    get_all_iolp_dev_info,
)
from schemas.iolp_schemas import (
    IolpDevInfoSchema,
    IolpDevConfigSchema,
    IolpDevStateSchema,
)
from database import get_db

iolp_router = APIRouter(prefix="/iolp", tags=["IOLP"])

# Rutas para iolp_dev_info
@iolp_router.post("/dev-info/")
def create_iolp_dev(dev_info: IolpDevInfoSchema, db: Session = Depends(get_db)):
    return create_iolp_dev_info(db, dev_info)

@iolp_router.get("/dev-info/{sn}")
def read_iolp_dev(sn: str, db: Session = Depends(get_db)):
    return get_iolp_dev_info(db, sn)

# Rutas para iolp_dev_config
@iolp_router.post("/dev-config/")
def create_iolp_config(dev_config: IolpDevConfigSchema, db: Session = Depends(get_db)):
    return create_iolp_dev_config(db, dev_config)

@iolp_router.get("/dev-config/{sn}")
def read_iolp_config(sn: str, db: Session = Depends(get_db)):
    return get_iolp_dev_config(db, sn)

# Rutas para iolp_dev_state
@iolp_router.post("/dev-state/")
def create_iolp_state(dev_state: IolpDevStateSchema, db: Session = Depends(get_db)):
    return create_iolp_dev_state(db, dev_state)

@iolp_router.get("/dev-state/{sn}")
def read_iolp_state(sn: str, db: Session = Depends(get_db)):
    return get_iolp_dev_state(db, sn)



@iolp_router.get("/dev-info/")
def read_all_iolp_devs(db: Session = Depends(get_db)):
    return get_all_iolp_dev_info(db)
