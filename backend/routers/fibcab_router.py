from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from controllers.fibcab_controller import (
    create_fibcab_dev_info,
    get_fibcab_dev_info,
    create_fibcab_dev_config,
    get_fibcab_dev_config,
    create_fibcab_dev_state,
    get_fibcab_dev_state,
    get_fibcabs_for_device,  # Nueva función para buscar fibras por dispositivo
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

# Ruta para obtener una fibra por SN
@fibcab_router.get("/dev-info/{sn}")
def read_fibcab_dev(sn: str, db: Session = Depends(get_db)):
    fibcab = get_fibcab_dev_info(db, sn)
    if not fibcab:
        raise HTTPException(status_code=404, detail="Fibcab dev info not found")
    return fibcab

# Nueva ruta para obtener fibras relacionadas con un dispositivo
@fibcab_router.get("/dev-info/")
def read_fibcabs_for_device(
    device_sn: str = Query(..., description="SN del dispositivo"), 
    db: Session = Depends(get_db)
):
    fibcabs = get_fibcabs_for_device(db, device_sn)
    if not fibcabs:
        raise HTTPException(status_code=404, detail="No fibcabs found for the given device SN")
    return fibcabs

# Rutas para fibcab_dev_config
@fibcab_router.post("/dev-config/")
def create_fibcab_config(dev_config: FibcabDevConfigSchema, db: Session = Depends(get_db)):
    return create_fibcab_dev_config(db, dev_config)

@fibcab_router.get("/dev-config/{sn}")
def read_fibcab_config(sn: str, db: Session = Depends(get_db)):
    fibcab_config = get_fibcab_dev_config(db, sn)
    if not fibcab_config:
        raise HTTPException(status_code=404, detail="Fibcab dev config not foundww")
    return fibcab_config

# Rutas para fibcab_dev_state
@fibcab_router.post("/dev-state/")
def create_fibcab_state(dev_state: FibcabDevStateSchema, db: Session = Depends(get_db)):
    return create_fibcab_dev_state(db, dev_state)

@fibcab_router.get("/dev-state/{sn}")
def read_fibcab_state(sn: str, db: Session = Depends(get_db)):
    fibcab_state = get_fibcab_dev_state(db, sn)
    if not fibcab_state:
        raise HTTPException(status_code=404, detail="Fibcab dev state not found")
    return fibcab_state