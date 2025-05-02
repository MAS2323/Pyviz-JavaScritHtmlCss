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
    calculate_fibcab_parameters,
    identify_bottlenecks,
    calculate_health_score,
    get_all_fibcab_dev_info,
    get_fibcab_status
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

@fibcab_router.get("/{sn}/status")
def read_fibcab_status(sn: str, db: Session = Depends(get_db)):
    return get_fibcab_status(db, sn)
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


@fibcab_router.get("/calculate/{fibcab_sn}")
def calculate_fibcab(fibcab_sn: str, db: Session = Depends(get_db)):
    try:
        results = calculate_fibcab_parameters(db, fibcab_sn)
        return results
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# Endpoint para identificar cuellos de botella
@fibcab_router.get("/bottlenecks")
def get_bottlenecks(db: Session = Depends(get_db)):
    try:
        bottlenecks = identify_bottlenecks(db)
        return bottlenecks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Endpoint para identificar cuellos de botella en un dispositivo específico
@fibcab_router.get("/bottlenecks/{device_sn}")
def get_bottlenecks_for_device(device_sn: str, db: Session = Depends(get_db)):
    """
    Endpoint para obtener los cuellos de botella relacionados con un dispositivo específico.
    """
    try:
        bottlenecks = identify_bottlenecks(db, device_sn)
        return {"device_sn": device_sn, "bottlenecks": bottlenecks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@fibcab_router.get("/health-score/")
def get_health_score(warnings: int = 0, crises: int = 0):
    """
    Endpoint para calcular el puntaje de salud basado en advertencias y crisis.
    """
    try:
        health_score = calculate_health_score(warnings, crises)
        return {"warnings": warnings, "crises": crises, "health_score": health_score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@fibcab_router.get("/dev-info-all/")
def read_all_fibcab_devs(db: Session = Depends(get_db)):
    return get_all_fibcab_dev_info(db)


@fibcab_router.get("/bottlenecks")
async def get_bottlenecks(db: Session = Depends(get_db)):
    return {"bottlenecks": identify_bottlenecks(db)}