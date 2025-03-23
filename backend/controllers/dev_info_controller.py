from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.device_info import DeviceInfo
from schemas.device_info_schema import DeviceInfoSchema

# Crear un registro en device_info
def create_device_info(db: Session, device_info: DeviceInfoSchema):
    db_device_info = DeviceInfo(**device_info.dict())
    db.add(db_device_info)
    db.commit()
    db.refresh(db_device_info)
    return db_device_info

# Obtener un registro de device_info por SN
def get_device_info(db: Session, sn: str):
    db_device_info = db.query(DeviceInfo).filter(DeviceInfo.sn == sn).first()
    if not db_device_info:
        raise HTTPException(status_code=404, detail="Device info not found")
    return db_device_info

# Actualizar un registro en device_info
def update_device_info(db: Session, sn: str, updated_info: DeviceInfoSchema):
    db_device_info = db.query(DeviceInfo).filter(DeviceInfo.sn == sn).first()
    if not db_device_info:
        raise HTTPException(status_code=404, detail="Device info not found")
    for key, value in updated_info.dict().items():
        setattr(db_device_info, key, value)
    db.commit()
    db.refresh(db_device_info)
    return db_device_info

# Eliminar un registro de device_info
def delete_device_info(db: Session, sn: str):
    db_device_info = db.query(DeviceInfo).filter(DeviceInfo.sn == sn).first()
    if not db_device_info:
        raise HTTPException(status_code=404, detail="Device info not found")
    db.delete(db_device_info)
    db.commit()
    return {"message": "Device info deleted successfully"}