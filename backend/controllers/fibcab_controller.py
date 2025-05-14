from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.fibcab_models import FibcabDevInfo, FibcabDevConfig, FibcabDevState
from schemas.fibcab_schemas import FibcabDevInfoSchema, FibcabDevConfigSchema, FibcabDevStateSchema
from sqlalchemy.orm import joinedload
from typing import List, Dict, Optional
from math import radians, sin, cos, sqrt, atan2

# Crear un registro en fibcab_dev_info
def create_fibcab_dev_info(db: Session, fibcab_dev_info: FibcabDevInfoSchema):
    db_fibcab_info = FibcabDevInfo(**fibcab_dev_info.dict())
    db.add(db_fibcab_info)
    db.commit()
    db.refresh(db_fibcab_info)
    return db_fibcab_info

# Obtener un registro de fibcab_dev_info por SN
def get_fibcab_dev_info(db, sn):
    fibcab = db.query(FibcabDevInfo).filter(FibcabDevInfo.sn == sn).options(
        joinedload(FibcabDevInfo.source_node),
        joinedload(FibcabDevInfo.target_node)
    ).first()
    return fibcab

# Crear un registro en fibcab_dev_config
def create_fibcab_dev_config(db: Session, fibcab_dev_config: FibcabDevConfigSchema):
    db_fibcab_config = FibcabDevConfig(**fibcab_dev_config.dict())
    db.add(db_fibcab_config)
    db.commit()
    db.refresh(db_fibcab_config)
    return db_fibcab_config

# Obtener un registro de fibcab_dev_config por SN
def get_fibcab_dev_config(db: Session, sn: str):
    db_fibcab_config = db.query(FibcabDevConfig).filter(FibcabDevConfig.sn == sn).first()
    if not db_fibcab_config:
        raise HTTPException(status_code=404, detail="FIBCAB device config not found")
    return db_fibcab_config

# Crear un registro en fibcab_dev_state
def create_fibcab_dev_state(db: Session, fibcab_dev_state: FibcabDevStateSchema):
    db_fibcab_state = FibcabDevState(**fibcab_dev_state.dict())
    db.add(db_fibcab_state)
    db.commit()
    db.refresh(db_fibcab_state)
    return db_fibcab_state

# Obtener un registro de fibcab_dev_state por SN
def get_fibcab_dev_state(db: Session, sn: str):
    db_fibcab_state = db.query(FibcabDevState).filter(FibcabDevState.sn == sn).first()
    if not db_fibcab_state:
        raise HTTPException(status_code=404, detail="FIBCAB device state not found")
    return db_fibcab_state

# Obtener fibras relacionadas con un dispositivo
def get_fibcabs_for_device(db: Session, device_sn: str):
    # Obtener todas las fibras relacionadas con el dispositivo
    fibcabs = (
        db.query(FibcabDevInfo)
        .options(
            joinedload(FibcabDevInfo.source_node),  # Cargar el nodo de origen
            joinedload(FibcabDevInfo.target_node),  # Cargar el nodo de destino
            joinedload(FibcabDevInfo.state)         # Cargar la relación state
        )
        .filter((FibcabDevInfo.source_sn == device_sn) | (FibcabDevInfo.target_sn == device_sn))
        .all()
    )

    # Formatear los datos para incluir las coordenadas geográficas
    fibcab_data = []
    for fibcab in fibcabs:
        # Manejar fibcab.state como una lista
        state = fibcab.state[0] if fibcab.state and isinstance(fibcab.state, list) else fibcab.state
        fibcab_data.append({
            "sn": fibcab.sn,
            "source_sn": fibcab.source_sn,
            "target_sn": fibcab.target_sn,
            "source_longitude": fibcab.source_node.longitude if fibcab.source_node else None,
            "source_latitude": fibcab.source_node.lattitude if fibcab.source_node else None,
            "target_longitude": fibcab.target_node.longitude if fibcab.target_node else None,
            "target_latitude": fibcab.target_node.lattitude if fibcab.target_node else None,
            "health_point": state.health_point if state else None,
        })

    return fibcab_data

# Obtener una fibra por SN
def get_fibcab_dev_info(db: Session, sn: str):
    fibcab = db.query(FibcabDevInfo).filter(FibcabDevInfo.sn == sn).first()
    if not fibcab:
        raise HTTPException(status_code=404, detail="Fibcab dev info not found")
    return fibcab

# Constante para el radio de la Tierra en kilómetros
EARTH_RADIUS_KM = 6371.0

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine.
    """
    # Convertir grados a radianes
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    # Diferencias de latitud y longitud
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    # Fórmula de Haversine
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    # Distancia en kilómetros
    distance = EARTH_RADIUS_KM * c
    return distance

def calculate_fibcab_parameters(db: Session, fibcab_sn: str):
    # Verificar si el fibcab existe
    fibcab_info = db.query(FibcabDevInfo).filter(FibcabDevInfo.sn == fibcab_sn).first()
    if not fibcab_info:
        raise ValueError(f"Fibcab SN {fibcab_sn} no encontrado")

    # Verificar nodos de origen y destino
    source_node = fibcab_info.source_node
    target_node = fibcab_info.target_node
    if not source_node or not target_node:
        raise ValueError("Nodos de origen o destino no encontrados para el fibcab")

    # Calcular distancia
    distance_km = calculate_distance(
        source_node.lattitude,
        source_node.longitude,
        target_node.lattitude,
        target_node.longitude
    )

    # Obtener configuración
    fibcab_config = db.query(FibcabDevConfig).filter(FibcabDevConfig.sn == fibcab_sn).first()
    if not fibcab_config:
        raise ValueError(f"Configuración no encontrada para el fibcab SN {fibcab_sn}")

    # Calcular atenuación total
    attenuation_coefficient = fibcab_config.opt2_fiber_attnuetion_coeff or 0.0
    connector_loss = fibcab_config.opt3_connector_loss or 0.0
    splice_loss = fibcab_config.opt3_splice_loss or 0.0

    total_attenuation = (
        distance_km * attenuation_coefficient +
        connector_loss +
        splice_loss
    )

    return {
        "distance_km": round(distance_km, 2),
        "total_attenuation_db": round(total_attenuation, 2),
        "fibcab_capacity": fibcab_config.ficab_capacity,
        "connector_loss_db": connector_loss,
        "splice_loss_db": splice_loss,
        "attenuation_coefficient_db_per_km": attenuation_coefficient,
    }
def identify_bottlenecks(db: Session, device_sn: Optional[str] = None, threshold: float = 0.75) -> List[Dict]:
    """
    Identifica cuellos de botella. Si se proporciona device_sn, filtra por ese dispositivo.
    El umbral se ajusta a 0.75 (75%) para alinearse con el estado de alerta.
    """
    bottlenecks = []

    query = (
        db.query(FibcabDevInfo, FibcabDevConfig, FibcabDevState)
        .join(FibcabDevConfig, FibcabDevInfo.sn == FibcabDevConfig.sn)
        .join(FibcabDevState, FibcabDevInfo.sn == FibcabDevState.sn)
    )

    if device_sn:
        query = query.filter(FibcabDevInfo.sn == device_sn)

    fibcabs_with_config_and_state = query.all()

    for fibcab, fibcab_config, fibcab_state in fibcabs_with_config_and_state:
        usage = fibcab_state.health_point or 0
        capacity = fibcab_config.ficab_capacity or 1  # Evitar división por cero

        # Calcular el porcentaje de utilización como el complemento de health_point (salud restante)
        utilization_percentage = min(100, 100 - usage)  # Limitar al 100% máximo

        if utilization_percentage > threshold * 100:
            bottlenecks.append({
                "sn": fibcab.sn,
                "usage": usage,
                "capacity": capacity,
                "utilization_percentage": round(utilization_percentage, 2),
                "status": "emergency" if utilization_percentage > 95 else "alert"  # Agregar estado para el frontend
            })

    return bottlenecks

def calculate_health_score(warnings: int, crises: int) -> int:
    """
    Calcula el puntaje de salud basado en advertencias y crisis.
    """
    health_score = 100 - (warnings * 5) - (crises * 10)
    return max(health_score, 0)  # Evita valores negativos

def get_all_fibcab_dev_info(db: Session) -> List[FibcabDevInfo]:
    """
    Obtener todos los registros de fibcab_dev_info con nodos fuente y destino.
    """
    return db.query(FibcabDevInfo).options(
        joinedload(FibcabDevInfo.source_node),
        joinedload(FibcabDevInfo.target_node)
    ).all()

def get_fibcab_status(db: Session, sn: str) -> Dict:
    """
    Obtiene el estado de un fibcab específico y asigna colores según el porcentaje de utilización.
    - < 25%: Verde (normal)
    - > 75%: Amarillo (alerta)
    - > 95%: Rojo (emergencia)
    """
    # Obtener fibcab info
    fibcab = db.query(FibcabDevInfo).filter(FibcabDevInfo.sn == sn).first()
    if not fibcab:
        raise HTTPException(status_code=404, detail="Fibcab no encontrado")

    state = db.query(FibcabDevState).filter(FibcabDevState.sn == sn).first()
    config = db.query(FibcabDevConfig).filter(FibcabDevConfig.sn == sn).first()

    # Calcular el porcentaje de utilización como el complemento de health_point
    capacity = config.ficab_capacity if config else 62
    usage = state.health_point or 0
    utilization_percentage = min(100, 100 - usage)  # Limitar al 100% máximo

    # Determinar el color y estado basado en el porcentaje de utilización
    if utilization_percentage > 95:
        fiber_color = "red"  # Emergencia
        status = "emergency"
    elif utilization_percentage > 75:
        fiber_color = "yellow"  # Alerta
        status = "alert"
    else:
        fiber_color = "green"  # Normal
        status = "normal"

    return {
        "sn": fibcab.sn,
        "name": fibcab.name,
        "source_sn": fibcab.source_sn,
        "target_sn": fibcab.target_sn,
        # Coordenadas
        "source_longitude": fibcab.source_node.longitude,
        "source_latitude": fibcab.source_node.lattitude,
        "target_longitude": fibcab.target_node.longitude,
        "target_latitude": fibcab.target_node.lattitude,
        # Estado
        "fiber_color": fiber_color,
        "status": status,
        "usage_percentage": round(utilization_percentage, 2),
        "warnings": state.warnings if state else None,
        "crises": state.crisis if state else None,
    }