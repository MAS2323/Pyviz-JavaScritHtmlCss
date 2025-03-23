from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from controllers.fibcab_controller import (
    create_fibcab_dev_info,
    get_fibcab_dev_info,
    create_fibcab_dev_config,
    get_fibcab_dev_config,
    create_fibcab_dev_state,
    get_fibcab_dev_state,
)
from schemas.fibcab_schemas import (
    FibcabDevInfoSchema,
    FibcabDevConfigSchema,
    FibcabDevStateSchema,
)
from database import get_db

fibcab_router = APIRouter(prefix="/fibcab", tags=["FIBCAB"])

# Rutas para fibcab_dev_info
@fibcab_router.post("/dev-info/")
def create_fibcab_dev(dev_info: FibcabDevInfoSchema, db: Session = Depends(get_db)):
    return create_fibcab_dev_info(db, dev_info)

@fibcab_router.get("/dev-info/{sn}")
def read_fibcab_dev(sn: str, db: Session = Depends(get_db)):
    return get_fibcab_dev_info(db, sn)

# Rutas para fibcab_dev_config
@fibcab_router.post("/dev-config/")
def create_fibcab_config(dev_config: FibcabDevConfigSchema, db: Session = Depends(get_db)):
    return create_fibcab_dev_config(db, dev_config)

@fibcab_router.get("/dev-config/{sn}")
def read_fibcab_config(sn: str, db: Session = Depends(get_db)):
    return get_fibcab_dev_config(db, sn)

# Rutas para fibcab_dev_state
@fibcab_router.post("/dev-state/")
def create_fibcab_state(dev_state: FibcabDevStateSchema, db: Session = Depends(get_db)):
    return create_fibcab_dev_state(db, dev_state)

@fibcab_router.get("/dev-state/{sn}")
def read_fibcab_state(sn: str, db: Session = Depends(get_db)):
    return get_fibcab_dev_state(db, sn)