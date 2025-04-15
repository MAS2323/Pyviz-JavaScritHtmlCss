from sqlalchemy.orm import Session
import pandas as pd
from models.device_info import DeviceInfo
from .utils import df_to_geojson

def get_devices_geojson(db: Session):
    devices = db.query(DeviceInfo).all()
    
    data = [{
        "sn": device.sn,
        "name": device.name,
        "city": device.city,
        "longitude": device.longitude,
        "latitude": device.lattitude,
        "type": device.Producer
    } for device in devices if device.longitude and device.lattitude]
    
    df = pd.DataFrame(data)
    return df_to_geojson(df, point_properties=["sn", "name", "city", "type"])