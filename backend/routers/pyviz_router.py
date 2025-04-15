from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from database import get_db
import holoviews as hv
from fastapi.responses import HTMLResponse
from controllers.pyviz_controller import process_device_data_with_pyviz
from services.visualization import (
    device_service,
    fibcab_service,
    cesium_adapter,
    health_service,
    performance_service,
    topology_service,
    traffic_service
)

pyviz_router = APIRouter(prefix="/pyviz", tags=["PyViz"])

# Endpoint para obtener datos procesados con PyViz
@pyviz_router.get("/processed-data")
def get_processed_data(db: Session = Depends(get_db)):
    geojson_data = process_device_data_with_pyviz(db)
    return geojson_data

@pyviz_router.get("/devices", response_class=JSONResponse)
def get_devices_visualization(db: Session = Depends(get_db)):
    """Obtiene dispositivos en formato GeoJSON"""
    geojson = device_service.get_devices_geojson(db)
    return JSONResponse(content=geojson)

@pyviz_router.get("/network", response_class=JSONResponse)
def get_network_visualization(db: Session = Depends(get_db)):
    """Obtiene conexiones de red en formato GeoJSON"""
    geojson = fibcab_service.get_fibcab_network_geojson(db)
    return JSONResponse(content=geojson)

@pyviz_router.get("/cesium-config", response_class=JSONResponse)
def get_cesium_configuration(db: Session = Depends(get_db)):
    """Genera configuración completa para CesiumJS"""
    devices = device_service.get_devices_geojson(db)
    network = fibcab_service.get_fibcab_network_geojson(db)
    
    # Combinar características
    combined_features = devices['features'] + network['features']
    combined_geojson = {"type": "FeatureCollection", "features": combined_features}
    
    czml = cesium_adapter.generate_cesium_config(combined_geojson)
    return JSONResponse(content=czml)


# @pyviz_router.get("/health-dashboard", response_class=HTMLResponse)
# def get_health_dashboard(db: Session = Depends(get_db)):
#     dashboard = health_service.create_health_dashboard(db)
#     return HTMLResponse(content=dashboard.save())

# @pyviz_router.get("/performance-dashboard", response_class=HTMLResponse)
# def get_performance_dashboard(db: Session = Depends(get_db)):
#     dashboard = performance_service.create_performance_dashboard(db)
#     return HTMLResponse(content=dashboard.save())

# @pyviz_router.get("/network-topology", response_class=HTMLResponse)
# def get_network_topology(db: Session = Depends(get_db)):
#     topology = topology_service.create_network_topology(db)
#     return HTMLResponse(content=hv.render(topology))

# @pyviz_router.get("/traffic-analysis", response_class=HTMLResponse)
# def get_traffic_analysis(db: Session = Depends(get_db)):
#     analysis = traffic_service.create_traffic_analysis(db)
#     return HTMLResponse(content=analysis.save())