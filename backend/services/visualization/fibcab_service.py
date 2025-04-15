from sqlalchemy.orm import Session
import pandas as pd
from models.fibcab_models import FibcabDevInfo
from models.device_info import DeviceInfo
from .utils import df_to_geojson

def get_fibcab_network_geojson(db: Session):
    fibcabs = db.query(FibcabDevInfo).all()
    devices = {d.sn: d for d in db.query(DeviceInfo).all()}
    
    connections = []
    for fib in fibcabs:
        source = devices.get(fib.source_sn)
        target = devices.get(fib.target_sn)
        
        if source and target and source.longitude and source.lattitude and target.longitude and target.lattitude:
            connections.append({
                "source_sn": fib.source_sn,
                "target_sn": fib.target_sn,
                "type": fib.Type,
                "lon1": source.longitude,
                "lat1": source.lattitude,
                "lon2": target.longitude,
                "lat2": target.lattitude
            })
    
    df = pd.DataFrame(connections)
    return df_to_geojson(df, line_properties=["source_sn", "target_sn", "type"])