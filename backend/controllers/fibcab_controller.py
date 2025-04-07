from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.fibcab_models import FibcabDevInfo, FibcabDevConfig, FibcabDevState
from schemas.fibcab_schemas import FibcabDevInfoSchema, FibcabDevConfigSchema, FibcabDevStateSchema
from sqlalchemy.orm import joinedload
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
# def get_fibcabs_for_device(db: Session, device_sn: str):
#     fibcabs = db.query(FibcabDevInfo).filter(
#         (FibcabDevInfo.source_sn == device_sn) | (FibcabDevInfo.target_sn == device_sn)
#     ).all()
#     return fibcabs
def get_fibcabs_for_device(db: Session, device_sn: str):
    # Obtener todas las fibras relacionadas con el dispositivo
    fibcabs = (
        db.query(FibcabDevInfo)
        .options(
            joinedload(FibcabDevInfo.source_node),  # Cargar el nodo de origen
            joinedload(FibcabDevInfo.target_node)   # Cargar el nodo de destino
        )
        .filter((FibcabDevInfo.source_sn == device_sn) | (FibcabDevInfo.target_sn == device_sn))
        .all()
    )

    # Formatear los datos para incluir las coordenadas geográficas
    fibcab_data = []
    for fibcab in fibcabs:
        fibcab_data.append({
            "sn": fibcab.sn,
            "source_sn": fibcab.source_sn,
            "target_sn": fibcab.target_sn,
            "source_longitude": fibcab.source_node.longitude if fibcab.source_node else None,
            "source_latitude": fibcab.source_node.lattitude if fibcab.source_node else None,
            "target_longitude": fibcab.target_node.longitude if fibcab.target_node else None,
            "target_latitude": fibcab.target_node.lattitude if fibcab.target_node else None,
            "health_point": fibcab.state.health_point if fibcab.state else None,
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
    """
    Calcula la distancia y parámetros relacionados para un fibcab específico.
    """
    # Obtener la información del fibcab
    fibcab_info = db.query(FibcabDevInfo).filter(FibcabDevInfo.sn == fibcab_sn).first()
    if not fibcab_info:
        raise ValueError(f"Fibcab SN {fibcab_sn} no encontrado")

    # Obtener las coordenadas de los nodos de origen y destino
    source_node = fibcab_info.source_node
    target_node = fibcab_info.target_node

    if not source_node or not target_node:
        raise ValueError("Nodos de origen o destino no encontrados para el fibcab")

    # Calcular la distancia entre los nodos
    distance_km = calculate_distance(
        source_node.lattitude,
        source_node.longitude,
        target_node.lattitude,
        target_node.longitude
    )

    # Obtener la configuración del fibcab
    fibcab_config = db.query(FibcabDevConfig).filter(FibcabDevConfig.sn == fibcab_sn).first()
    if not fibcab_config:
        raise ValueError(f"Configuración no encontrada para el fibcab SN {fibcab_sn}")

    # Calcular la atenuación total
    attenuation_coefficient = fibcab_config.opt2_fiber_attnuetion_coeff or 0.0
    connector_loss = fibcab_config.opt3_connector_loss or 0.0
    splice_loss = fibcab_config.opt3_splice_loss or 0.0

    # Atenuación total = (distancia * coeficiente de atenuación) + pérdidas por conectores y empalmes
    total_attenuation = (
        distance_km * attenuation_coefficient +
        connector_loss +
        splice_loss
    )

    # Retornar los resultados
    return {
        "distance_km": round(distance_km, 2),
        "total_attenuation_db": round(total_attenuation, 2),
        "fibcab_capacity": fibcab_config.ficab_capacity,
        "connector_loss_db": connector_loss,
        "splice_loss_db": splice_loss,
        "attenuation_coefficient_db_per_km": attenuation_coefficient,
}
    
    


def identify_bottlenecks(db: Session):
    """
    Identifica los cuellos de botella en las fibras (fibcabs) basándose en su uso y capacidad.
    """
    bottlenecks = []

    # Obtener todas las fibras con su configuración
    fibcabs = db.query(FibcabDevInfo).all()

    for fibcab in fibcabs:
        # Obtener la configuración de la fibra
        fibcab_config = db.query(FibcabDevConfig).filter(FibcabDevConfig.sn == fibcab.sn).first()
        if not fibcab_config:
            continue

        # Supongamos que el uso actual se obtiene de algún modelo o cálculo previo
        # Por ejemplo, podrías obtenerlo de FibcabDevState o calcularlo dinámicamente
        fibcab_state = db.query(FibcabDevState).filter(FibcabDevState.sn == fibcab.sn).first()
        if not fibcab_state:
            continue

        # Uso actual y capacidad máxima
        usage = fibcab_state.health_point or 0  # Ejemplo: usar health_point como proxy del uso
        capacity = fibcab_config.ficab_capacity or 1  # Evitar división por cero

        # Calcular si hay un cuello de botella
        if usage > capacity * 0.8:  # Umbral del 80%
            bottlenecks.append({
                "sn": fibcab.sn,
                "usage": usage,
                "capacity": capacity,
                "utilization_percentage": round(usage / capacity * 100, 2)
            })

    return bottlenecks


def calculate_health_score(warnings, crises):
    """
    Calcula el puntaje de salud basado en advertencias y crisis.
    """
    health_score = 100 - (warnings * 5) - (crises * 10)
    return max(health_score, 0)  # Evita valores negativos



# Obtener todos los registros de fibcab_dev_info
def get_all_fibcab_dev_info(db: Session):
    return db.query(FibcabDevInfo).options(
        joinedload(FibcabDevInfo.source_node),
        joinedload(FibcabDevInfo.target_node)
    ).all()