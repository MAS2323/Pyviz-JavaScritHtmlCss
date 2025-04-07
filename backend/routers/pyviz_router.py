from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from controllers.pyviz_controller import process_device_data_with_pyviz

pyviz_router = APIRouter(prefix="/pyviz", tags=["PyViz"])

# Endpoint para obtener datos procesados con PyViz
@pyviz_router.get("/processed-data")
def get_processed_data(db: Session = Depends(get_db)):
    geojson_data = process_device_data_with_pyviz(db)
    return geojson_data