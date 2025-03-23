from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from controllers.dev_info_controller import (
    create_device_info,
    get_device_info,
    get_all_devices,  # Importamos la nueva función
    update_device_info,
    delete_device_info,
)
from schemas.device_info_schema import DeviceInfoSchema
from database import get_db

dev_info_router = APIRouter(prefix="/device-info", tags=["Device Info"])

# Ruta para crear un dispositivo
@dev_info_router.post("/")
def create_device(dev_info: DeviceInfoSchema, db: Session = Depends(get_db)):
    return create_device_info(db, dev_info)

# Ruta para obtener un dispositivo por SN
@dev_info_router.get("/{sn}")
def read_device(sn: str, db: Session = Depends(get_db)):
    return get_device_info(db, sn)

# Ruta para obtener todos los dispositivos
@dev_info_router.get("/")
def read_all_devices(db: Session = Depends(get_db)):
    return get_all_devices(db)

# Ruta para actualizar un dispositivo
@dev_info_router.put("/{sn}")
def update_device(sn: str, dev_info: DeviceInfoSchema, db: Session = Depends(get_db)):
    return update_device_info(db, sn, dev_info)

# Ruta para eliminar un dispositivo
@dev_info_router.delete("/{sn}")
def delete_device(sn: str, db: Session = Depends(get_db)):
    return delete_device_info(db, sn)