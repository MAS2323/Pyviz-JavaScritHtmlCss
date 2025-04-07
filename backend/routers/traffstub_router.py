from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from controllers.traffstub_controller import (
    create_traffstub_dev_info,
    get_traffstub_dev_info,
    create_traffstub_dev_config,
    get_traffstub_dev_config,
    create_traffstub_dev_state,
    get_traffstub_dev_state,
    get_all_traffstub_dev_info,
)
from schemas.traffstub_schemas import (
    TraffstubDevInfoSchema,
    TraffstubDevConfigSchema,
    TraffstubDevStateSchema,
)
from database import get_db

traffstub_router = APIRouter(prefix="/traffstub", tags=["TRAFFSTUB"])

# Rutas para traffstub_dev_info
@traffstub_router.post("/dev-info/")
def create_traffstub_dev(dev_info: TraffstubDevInfoSchema, db: Session = Depends(get_db)):
    return create_traffstub_dev_info(db, dev_info)

@traffstub_router.get("/dev-info/{sn}")
def read_traffstub_dev(sn: str, db: Session = Depends(get_db)):
    return get_traffstub_dev_info(db, sn)

# Rutas para traffstub_dev_config
@traffstub_router.post("/dev-config/")
def create_traffstub_config(dev_config: TraffstubDevConfigSchema, db: Session = Depends(get_db)):
    return create_traffstub_dev_config(db, dev_config)

@traffstub_router.get("/dev-config/{sn}")
def read_traffstub_config(sn: str, db: Session = Depends(get_db)):
    return get_traffstub_dev_config(db, sn)

# Rutas para traffstub_dev_state
@traffstub_router.post("/dev-state/")
def create_traffstub_state(dev_state: TraffstubDevStateSchema, db: Session = Depends(get_db)):
    return create_traffstub_dev_state(db, dev_state)

@traffstub_router.get("/dev-state/{sn}")
def read_traffstub_state(sn: str, db: Session = Depends(get_db)):
    return get_traffstub_dev_state(db, sn)


@traffstub_router.get("/dev-info/", response_model=list[TraffstubDevInfoSchema])
def read_all_traffstub_devs(db: Session = Depends(get_db)):
    return get_all_traffstub_dev_info(db)