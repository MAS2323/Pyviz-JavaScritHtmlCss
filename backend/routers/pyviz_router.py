from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from database import get_db
import holoviews as hv
from fastapi.responses import HTMLResponse
from controllers.pyviz_controller import (
    process_device_data_with_pyviz,  
    monitor_errors, 
    monitor_bottlenecks, 
    monitor_traffic, 
    visualize_network_topology,
    monitor_jmpmat_ports,
    monitor_iolp_optical_performance,
    monitor_sdh_traffic_capacity,
    monitor_health_trends
)
from services.visualization import (
    device_service,
    fibcab_service,
    cesium_adapter,
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


@pyviz_router.get("/errors")
async def get_errors(component_type: str = None, db: Session = Depends(get_db)):
    """
    Obtiene errores (alertas y crisis) para un componente o todos.
    """
    try:
        result = monitor_errors(db, component_type)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@pyviz_router.get("/bottlenecks")
async def get_bottlenecks(component_type: str = None, db: Session = Depends(get_db)):
    """
    Identifica cuellos de botella para un componente o todos.
    """
    try:
        result = monitor_bottlenecks(db, component_type)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@pyviz_router.get("/traffic")
async def get_traffic(time_window_hours: int = 24, db: Session = Depends(get_db)):
    """
    Monitorea el tráfico en un período de tiempo (en horas).
    """
    try:
        if time_window_hours < 1:
            raise HTTPException(status_code=400, detail="El período debe ser al menos 1 hora")
        return monitor_traffic(db, time_window_hours)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@pyviz_router.get("/topology")
async def get_topology(db: Session = Depends(get_db)):
    """
    Obtiene la topología de red (conexiones FIBCAB).
    """
    try:
        return visualize_network_topology(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    


@pyviz_router.get("/devices")
async def get_devices(db: Session = Depends(get_db)):
    """
    Obtiene datos de dispositivos para visualización.
    """
    return process_device_data_with_pyviz(db)

@pyviz_router.get("/errors")
async def get_errors(component_type: str = None, db: Session = Depends(get_db)):
    """
    Obtiene errores (alertas y crisis) para un componente o todos.
    """
    result = monitor_errors(db, component_type)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@pyviz_router.get("/bottlenecks")
async def get_bottlenecks(component_type: str = None, db: Session = Depends(get_db)):
    """
    Identifica cuellos de botella para un componente o todos.
    """
    result = monitor_bottlenecks(db, component_type)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@pyviz_router.get("/traffic")
async def get_traffic(time_window_hours: int = 24, db: Session = Depends(get_db)):
    """
    Monitorea el tráfico en un período de tiempo (en horas).
    """
    if time_window_hours < 1:
        raise HTTPException(status_code=400, detail="El período debe ser al menos 1 hora")
    return monitor_traffic(db, time_window_hours)

@pyviz_router.get("/topology")
async def get_topology(db: Session = Depends(get_db)):
    """
    Obtiene la topología de red (conexiones FIBCAB).
    """
    return visualize_network_topology(db)

@pyviz_router.get("/jmpmat-ports")
async def get_jmpmat_ports(db: Session = Depends(get_db)):
    """
    Monitorea la utilización de puertos en JmpMat.
    """
    return monitor_jmpmat_ports(db)

@pyviz_router.get("/iolp-optical")
async def get_iolp_optical(db: Session = Depends(get_db)):
    """
    Monitorea anomalías en la potencia óptica de IOLP.
    """
    return monitor_iolp_optical_performance(db)

@pyviz_router.get("/sdh-traffic")
async def get_sdh_traffic(db: Session = Depends(get_db)):
    """
    Monitorea la capacidad y tráfico en SDH.
    """
    return monitor_sdh_traffic_capacity(db)

@pyviz_router.get("/health-trends")
async def get_health_trends(component_type: str = None, time_window_days: int = 7, db: Session = Depends(get_db)):
    """
    Analiza tendencias de health_point en un período de tiempo (en días).
    """
    if time_window_days < 1:
        raise HTTPException(status_code=400, detail="El período debe ser al menos 1 día")
    result = monitor_health_trends(db, component_type, time_window_days)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result