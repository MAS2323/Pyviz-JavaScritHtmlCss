from sqlalchemy.orm import Session
from models.device_info import DeviceInfo
from models.fibcab_models import FibcabDevInfo, FibcabDevConfig, FibcabDevState
from models.iolp_models import IolpDevInfo, IolpDevConfig, IolpDevState
from models.sdh_models import SdhDevInfo, SdhDevConfig, SdhDevState
from models.jmpmat_models import JmpMat
from models.traffstub_models import TraffstubDevInfo, TraffstubDevConfig, TraffstubDevState
import pandas as pd
import geopandas as gpd
import datashader as ds
import datashader.transfer_functions as tf
from colorcet import fire, blues, rainbow
from geojson import Feature, FeatureCollection, Point, LineString
from datetime import datetime, timedelta
from sqlalchemy import func


def process_device_data_with_pyviz(db: Session):
    """
    Procesa datos de dispositivos para visualización con PyViz.
    Retorna un GeoJSON con información de dispositivos.
    """
    devices = db.query(DeviceInfo).all()

    data = [
        {
            "sn": device.sn,
            "name": device.name,
            "city": device.city,
            "longitude": device.longitude,
            "latitude": device.lattitude,
        }
        for device in devices
    ]
    df = pd.DataFrame(data)

    gdf = gpd.GeoDataFrame(
        df,
        geometry=gpd.points_from_xy(df["longitude"], df["latitude"]),
        crs="EPSG:4326"
    )

    canvas = ds.Canvas(plot_width=800, plot_height=600)
    agg = canvas.points(gdf, 'longitude', 'latitude')
    img = tf.shade(agg, cmap=fire)

    features = []
    for _, row in gdf.iterrows():
        point = Point((row["longitude"], row["latitude"]))
        feature = Feature(geometry=point, properties={"name": row["name"], "city": row["city"]})
        features.append(feature)

    return FeatureCollection(features)

def monitor_errors(db: Session, component_type: str = None):
    """
    Monitorea errores (alertas y crisis) en los componentes especificados o todos.
    Retorna un GeoJSON con los dispositivos con errores y su ubicación.
    """
    components = {
        "FIBCAB": FibcabDevState,
        "IOLP": IolpDevState,
        "SDH": SdhDevState,
        "TRAFFSTUB": TraffstubDevState,
    }
    
    if component_type and component_type not in components:
        return {"error": f"Componente {component_type} no soportado"}
    
    target_components = [components[component_type]] if component_type else components.values()
    
    errors = []
    for component_model in target_components:
        component_errors = db.query(component_model).filter(
            (component_model.warnings != None) | (component_model.crisis != None)
        ).all()
        
        for error in component_errors:
            device = db.query(DeviceInfo).filter(DeviceInfo.sn == error.sn).first()
            if device:
                errors.append({
                    "sn": error.sn,
                    "component": component_model.__tablename__,
                    "warnings": error.warnings or "N/A",
                    "crisis": error.crisis or "N/A",
                    "longitude": device.longitude,
                    "latitude": device.lattitude,
                    "city": device.city,
                })
    
    if not errors:
        return FeatureCollection([])
    
    df = pd.DataFrame(errors)
    gdf = gpd.GeoDataFrame(
        df,
        geometry=gpd.points_from_xy(df["longitude"], df["latitude"]),
        crs="EPSG:4326"
    )
    
    canvas = ds.Canvas(plot_width=800, plot_height=600)
    agg = canvas.points(gdf, 'longitude', 'latitude')
    img = tf.shade(agg, cmap=fire)
    
    features = []
    for _, row in gdf.iterrows():
        point = Point((row["longitude"], row["latitude"]))
        properties = {
            "sn": row["sn"],
            "component": row["component"],
            "warnings": row["warnings"],
            "crisis": row["crisis"],
            "city": row["city"]
        }
        features.append(Feature(geometry=point, properties=properties))
    
    return FeatureCollection(features)

def monitor_bottlenecks(db: Session, component_type: str = None):
    """
    Identifica cuellos de botella basados en salud y métricas de capacidad.
    Retorna un GeoJSON con los dispositivos en riesgo.
    """
    components = {
        "FIBCAB": (FibcabDevState, FibcabDevConfig),
        "IOLP": (IolpDevState, IolpDevConfig),
        "SDH": (SdhDevState, SdhDevConfig),
        "TRAFFSTUB": (TraffstubDevState, TraffstubDevConfig),
    }
    
    if component_type and component_type not in components:
        return {"error": f"Componente {component_type} no soportado"}
    
    target_components = [components[component_type]] if component_type else components.values()
    
    bottlenecks = []
    for state_model, config_model in target_components:
        states = db.query(state_model).all()
        for state in states:
            config = db.query(config_model).filter(config_model.sn == state.sn).first()
            device = db.query(DeviceInfo).filter(DeviceInfo.sn == state.sn).first()
            
            if not (state and config and device):
                continue
            
            health = state.health_point or 100
            is_bottleneck = False
            bottleneck_type = []
            
            if health < 70:
                is_bottleneck = True
                bottleneck_type.append("Low Health")
            
            if state_model == FibcabDevState and config.ficab_capacity:
                bottlenecks.append({
                    "sn": state.sn,
                    "component": state_model.__tablename__,
                    "health_point": health,
                    "capacity": config.ficab_capacity,
                    "metric": "Capacity",
                    "bottleneck_type": ", ".join(bottleneck_type),
                    "longitude": device.longitude,
                    "latitude": device.lattitude,
                    "city": device.city,
                })
            elif state_model == IolpDevState and config.actived_pairs:
                active_count = len(config.actived_pairs.split(",")) if config.actived_pairs else 0
                if active_count < 2:
                    is_bottleneck = True
                    bottleneck_type.append("Low Active Pairs")
            elif state_model == SdhDevState and (config.opt1_traffic or config.opt2_traffic):
                traffic = (config.opt1_traffic or "") + (config.opt2_traffic or "")
                if "HIGH" in traffic.upper():
                    is_bottleneck = True
                    bottleneck_type.append("High Traffic")
            
            if is_bottleneck:
                bottlenecks.append({
                    "sn": state.sn,
                    "component": state_model.__tablename__,
                    "health_point": health,
                    "capacity": getattr(config, 'ficab_capacity', None) or "N/A",
                    "metric": bottleneck_type[-1] if bottleneck_type else "N/A",
                    "bottleneck_type": ", ".join(bottleneck_type),
                    "longitude": device.longitude,
                    "latitude": device.lattitude,
                    "city": device.city,
                })
    
    if not bottlenecks:
        return FeatureCollection([])
    
    df = pd.DataFrame(bottlenecks)
    gdf = gpd.GeoDataFrame(
        df,
        geometry=gpd.points_from_xy(df["longitude"], df["latitude"]),
        crs="EPSG:4326"
    )
    
    canvas = ds.Canvas(plot_width=800, plot_height=600)
    agg = canvas.points(gdf, 'longitude', 'latitude')
    img = tf.shade(agg, cmap=blues)
    
    features = []
    for _, row in gdf.iterrows():
        point = Point((row["longitude"], row["latitude"]))
        properties = {
            "sn": row["sn"],
            "component": row["component"],
            "health_point": row["health_point"],
            "capacity": row["capacity"],
            "metric": row["metric"],
            "bottleneck_type": row["bottleneck_type"],
            "city": row["city"]
        }
        features.append(Feature(geometry=point, properties=properties))
    
    return FeatureCollection(features)

def monitor_traffic(db: Session, time_window_hours: int = 24):
    """
    Monitorea el tráfico en TRAFFSTUB y FIBCAB en un período de tiempo.
    Retorna un GeoJSON con estadísticas de tráfico.
    """
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(hours=time_window_hours)
    
    traffic_data = db.query(TraffstubDevState).filter(
        TraffstubDevState.timestamp >= start_time,
        TraffstubDevState.timestamp <= end_time
    ).all()
    
    traffic_records = []
    for record in traffic_data:
        device = db.query(DeviceInfo).filter(DeviceInfo.sn == record.sn).first()
        if device:
            traffic_records.append({
                "sn": record.sn,
                "component": "TRAFFSTUB",
                "traffic_metric": record.warnings or "N/A",
                "timestamp": record.timestamp.isoformat(),
                "longitude": device.longitude,
                "latitude": device.lattitude,
                "city": device.city,
            })
    
    fibcab_configs = db.query(FibcabDevConfig).filter(
        FibcabDevConfig.ficab_capacity != None
    ).all()
    
    for fibcab in fibcab_configs:
        device = db.query(DeviceInfo).filter(DeviceInfo.sn == fibcab.sn).first()
        if device:
            traffic_records.append({
                "sn": fibcab.sn,
                "component": "FIBCAB",
                "traffic_metric": fibcab.ficab_capacity,
                "timestamp": datetime.utcnow().isoformat(),
                "longitude": device.longitude,
                "latitude": device.lattitude,
                "city": device.city,
            })
    
    if not traffic_records:
        return FeatureCollection([])
    
    df = pd.DataFrame(traffic_records)
    gdf = gpd.GeoDataFrame(
        df,
        geometry=gpd.points_from_xy(df["longitude"], df["latitude"]),
        crs="EPSG:4326"
    )
    
    canvas = ds.Canvas(plot_width=800, plot_height=600)
    agg = canvas.points(gdf, 'longitude', 'latitude')
    img = tf.shade(agg, cmap=fire)
    
    features = []
    for _, row in gdf.iterrows():
        point = Point((row["longitude"], row["latitude"]))
        properties = {
            "sn": row["sn"],
            "component": row["component"],
            "traffic_metric": row["traffic_metric"],
            "timestamp": row["timestamp"],
            "city": row["city"]
        }
        features.append(Feature(geometry=point, properties=properties))
    
    return FeatureCollection(features)

def visualize_network_topology(db: Session):
    """
    Genera una visualización de la topología de red (FIBCAB conexiones).
    Retorna un GeoJSON con líneas entre dispositivos conectados.
    """
    fibcabs = db.query(FibcabDevInfo).all()
    
    features = []
    for fibcab in fibcabs:
        source_device = db.query(DeviceInfo).filter(DeviceInfo.sn == fibcab.source_sn).first()
        target_device = db.query(DeviceInfo).filter(DeviceInfo.sn == fibcab.target_sn).first()
        
        if source_device and target_device:
            line = LineString([
                (source_device.longitude, source_device.lattitude),
                (target_device.longitude, target_device.lattitude)
            ])
            config = db.query(FibcabDevConfig).filter(FibcabDevConfig.sn == fibcab.sn).first()
            properties = {
                "sn": fibcab.sn,
                "source_sn": fibcab.source_sn,
                "target_sn": fibcab.target_sn,
                "capacity": config.ficab_capacity if config else "N/A"
            }
            features.append(Feature(geometry=line, properties=properties))
    
    return FeatureCollection(features)


def monitor_jmpmat_ports(db: Session):
    """
    Monitorea la utilización de puertos en JmpMat.
    Retorna un GeoJSON con dispositivos con baja utilización de puertos (< 20%).
    """
    jmpmats = db.query(JmpMat).all()
    
    port_issues = []
    for jmpmat in jmpmats:
        device = db.query(DeviceInfo).filter(DeviceInfo.sn == jmpmat.sn).first()
        if device and jmpmat.maxPorts and jmpmat.actNum:
            utilization = jmpmat.actNum / jmpmat.maxPorts
            if utilization < 0.2:  # Menos del 20% de puertos activos
                port_issues.append({
                    "sn": jmpmat.sn,
                    "component": "JMPMAT",
                    "actNum": jmpmat.actNum,
                    "maxPorts": jmpmat.maxPorts,
                    "utilization": round(utilization * 100, 2),
                    "longitude": device.longitude,
                    "latitude": device.lattitude,
                    "city": device.city,
                })
    
    if not port_issues:
        return FeatureCollection([])
    
    df = pd.DataFrame(port_issues)
    gdf = gpd.GeoDataFrame(
        df,
        geometry=gpd.points_from_xy(df["longitude"], df["latitude"]),
        crs="EPSG:4326"
    )
    
    canvas = ds.Canvas(plot_width=800, plot_height=600)
    agg = canvas.points(gdf, 'longitude', 'latitude')
    img = tf.shade(agg, cmap=rainbow)
    
    features = []
    for _, row in gdf.iterrows():
        point = Point((row["longitude"], row["latitude"]))
        properties = {
            "sn": row["sn"],
            "component": row["component"],
            "actNum": row["actNum"],
            "maxPorts": row["maxPorts"],
            "utilization": row["utilization"],
            "city": row["city"]
        }
        features.append(Feature(geometry=point, properties=properties))
    
    return FeatureCollection(features)

def monitor_iolp_optical_performance(db: Session):
    """
    Monitorea anomalías en la potencia óptica de IOLP (alta varianza o valores extremos).
    Retorna un GeoJSON con dispositivos con problemas ópticos.
    """
    iolp_states = db.query(IolpDevState).filter(
        (IolpDevState.opt_pow_mean != None) |
        (IolpDevState.opt_pow_var != None) |
        (IolpDevState.opt_pow_max != None) |
        (IolpDevState.opt_pow_min != None)
    ).all()
    
    optical_issues = []
    for state in iolp_states:
        device = db.query(DeviceInfo).filter(DeviceInfo.sn == state.sn).first()
        if not device:
            continue
        
        issue_types = []
        if state.opt_pow_var and state.opt_pow_var > 1.0:  # Alta varianza (> 1.0 dBm)
            issue_types.append("High Variance")
        if state.opt_pow_mean and (state.opt_pow_mean < -30 or state.opt_pow_mean > -10):  # Fuera de rango típico
            issue_types.append("Out of Range Mean")
        if state.opt_pow_max and state.opt_pow_max > -5:  # Máximo demasiado alto
            issue_types.append("High Max")
        if state.opt_pow_min and state.opt_pow_min < -35:  # Mínimo demasiado bajo
            issue_types.append("Low Min")
        
        if issue_types:
            optical_issues.append({
                "sn": state.sn,
                "component": "IOLP",
                "opt_pow_mean": state.opt_pow_mean or "N/A",
                "opt_pow_var": state.opt_pow_var or "N/A",
                "opt_pow_max": state.opt_pow_max or "N/A",
                "opt_pow_min": state.opt_pow_min or "N/A",
                "issue_types": ", ".join(issue_types),
                "longitude": device.longitude,
                "latitude": device.lattitude,
                "city": device.city,
            })
    
    if not optical_issues:
        return FeatureCollection([])
    
    df = pd.DataFrame(optical_issues)
    gdf = gpd.GeoDataFrame(
        df,
        geometry=gpd.points_from_xy(df["longitude"], df["latitude"]),
        crs="EPSG:4326"
    )
    
    canvas = ds.Canvas(plot_width=800, plot_height=600)
    agg = canvas.points(gdf, 'longitude', 'latitude')
    img = tf.shade(agg, cmap=fire)
    
    features = []
    for _, row in gdf.iterrows():
        point = Point((row["longitude"], row["latitude"]))
        properties = {
            "sn": row["sn"],
            "component": row["component"],
            "opt_pow_mean": row["opt_pow_mean"],
            "opt_pow_var": row["opt_pow_var"],
            "opt_pow_max": row["opt_pow_max"],
            "opt_pow_min": row["opt_pow_min"],
            "issue_types": row["issue_types"],
            "city": row["city"]
        }
        features.append(Feature(geometry=point, properties=properties))
    
    return FeatureCollection(features)

def monitor_sdh_traffic_capacity(db: Session):
    """
    Monitorea la capacidad y tráfico en SDH basado en configuración.
    Retorna un GeoJSON con dispositivos con tráfico alto o configuraciones críticas.
    """
    sdh_states = db.query(SdhDevState).all()
    
    traffic_issues = []
    for state in sdh_states:
        config = db.query(SdhDevConfig).filter(SdhDevConfig.sn == state.sn).first()
        device = db.query(DeviceInfo).filter(DeviceInfo.sn == state.sn).first()
        if not (config and device):
            continue
        
        issue_types = []
        health = state.health_point or 100
        
        # Verificar tráfico alto o salud baja
        if health < 70:
            issue_types.append("Low Health")
        if config.opt1_traffic and "HIGH" in config.opt1_traffic.upper():
            issue_types.append("High Opt1 Traffic")
        if config.opt2_traffic and "HIGH" in config.opt2_traffic.upper():
            issue_types.append("High Opt2 Traffic")
        
        if issue_types:
            traffic_issues.append({
                "sn": state.sn,
                "component": "SDH",
                "health_point": health,
                "opt1_traffic": config.opt1_traffic or "N/A",
                "opt2_traffic": config.opt2_traffic or "N/A",
                "issue_types": ", ".join(issue_types),
                "longitude": device.longitude,
                "latitude": device.lattitude,
                "city": device.city,
            })
    
    if not traffic_issues:
        return FeatureCollection([])
    
    df = pd.DataFrame(traffic_issues)
    gdf = gpd.GeoDataFrame(
        df,
        geometry=gpd.points_from_xy(df["longitude"], df["latitude"]),
        crs="EPSG:4326"
    )
    
    canvas = ds.Canvas(plot_width=800, plot_height=600)
    agg = canvas.points(gdf, 'longitude', 'latitude')
    img = tf.shade(agg, cmap=blues)
    
    features = []
    for _, row in gdf.iterrows():
        point = Point((row["longitude"], row["latitude"]))
        properties = {
            "sn": row["sn"],
            "component": row["component"],
            "health_point": row["health_point"],
            "opt1_traffic": row["opt1_traffic"],
            "opt2_traffic": row["opt2_traffic"],
            "issue_types": row["issue_types"],
            "city": row["city"]
        }
        features.append(Feature(geometry=point, properties=properties))
    
    return FeatureCollection(features)

def monitor_health_trends(db: Session, component_type: str = None, time_window_days: int = 7):
    """
    Analiza tendencias de health_point en los últimos días para detectar degradación.
    Retorna un GeoJSON con dispositivos con tendencias negativas.
    """
    components = {
        "FIBCAB": FibcabDevState,
        "IOLP": IolpDevState,
        "SDH": SdhDevState,
        "TRAFFSTUB": TraffstubDevState,
    }
    
    if component_type and component_type not in components:
        return {"error": f"Componente {component_type} no soportado"}
    
    target_components = [components[component_type]] if component_type else components.values()
    
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=time_window_days)
    
    trends = []
    for component_model in target_components:
        # Agrupar por sn y calcular promedio y cambio en health_point
        records = db.query(
            component_model.sn,
            func.avg(component_model.health_point).label("avg_health"),
            func.max(component_model.health_point) - func.min(component_model.health_point).label("health_change")
        ).filter(
            component_model.timestamp >= start_time,
            component_model.timestamp <= end_time,
            component_model.health_point != None
        ).group_by(component_model.sn).all()
        
        for record in records:
            device = db.query(DeviceInfo).filter(DeviceInfo.sn == record.sn).first()
            if device and record.health_change and record.health_change > 10:  # Caída significativa
                trends.append({
                    "sn": record.sn,
                    "component": component_model.__tablename__,
                    "avg_health": round(record.avg_health, 2),
                    "health_change": round(record.health_change, 2),
                    "longitude": device.longitude,
                    "latitude": device.lattitude,
                    "city": device.city,
                })
    
    if not trends:
        return FeatureCollection([])
    
    df = pd.DataFrame(trends)
    gdf = gpd.GeoDataFrame(
        df,
        geometry=gpd.points_from_xy(df["longitude"], df["latitude"]),
        crs="EPSG:4326"
    )
    
    canvas = ds.Canvas(plot_width=800, plot_height=600)
    agg = canvas.points(gdf, 'longitude', 'latitude')
    img = tf.shade(agg, cmap=rainbow)
    
    features = []
    for _, row in gdf.iterrows():
        point = Point((row["longitude"], row["latitude"]))
        properties = {
            "sn": row["sn"],
            "component": row["component"],
            "avg_health": row["avg_health"],
            "health_change": row["health_change"],
            "city": row["city"]
        }
        features.append(Feature(geometry=point, properties=properties))
    
    return FeatureCollection(features)