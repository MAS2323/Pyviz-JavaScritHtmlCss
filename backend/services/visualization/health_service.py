from sqlalchemy.orm import Session
from models.fibcab_models import FibcabDevState, FibcabDevInfo
from models.device_info import DeviceInfo

class HealthService:
    """
    Servicio para gestionar la salud y el estado de los dispositivos.
    """

    @staticmethod
    def get_device_health(db: Session, sn: str):
        """
        Recupera el estado de salud de un dispositivo específico por su número de serie (sn).

        :param db: Sesión de base de datos SQLAlchemy.
        :param sn: Número de serie del dispositivo.
        :return: Diccionario con la información de salud del dispositivo o None si no existe.
        """
        state = (
            db.query(FibcabDevState)
            .filter(FibcabDevState.sn == sn)
            .first()
        )
        if not state:
            return None

        return {
            "sn": state.sn,
            "health_point": state.health_point,
            "warnings": state.warnings,
            "crisis": state.crisis,
            "warnlog_url": state.warnlog_url,
            "crislog_url": state.crislog_url,
            "rawfile_url": state.rawfile_url,
        }

    @staticmethod
    def get_all_devices_health(db: Session):
        """
        Recupera el estado de salud de todos los dispositivos.

        :param db: Sesión de base de datos SQLAlchemy.
        :return: Lista de diccionarios con la información de salud de cada dispositivo.
        """
        states = db.query(FibcabDevState).all()
        health_data = [
            {
                "sn": state.sn,
                "health_point": state.health_point,
                "warnings": state.warnings,
                "crisis": state.crisis,
                "warnlog_url": state.warnlog_url,
                "crislog_url": state.crislog_url,
                "rawfile_url": state.rawfile_url,
            }
            for state in states
        ]
        return health_data

    @staticmethod
    def get_health_summary(db: Session):
        """
        Genera un resumen estadístico del estado de salud de todos los dispositivos.

        :param db: Sesión de base de datos SQLAlchemy.
        :return: Diccionario con estadísticas de salud.
        """
        states = db.query(FibcabDevState).all()

        if not states:
            return {
                "total_devices": 0,
                "average_health": 0,
                "healthy_devices": 0,
                "critical_devices": 0,
            }

        total_devices = len(states)
        total_health = sum(state.health_point for state in states if state.health_point is not None)
        average_health = total_health / total_devices if total_devices > 0 else 0
        healthy_devices = sum(1 for state in states if state.health_point and state.health_point >= 75)
        critical_devices = sum(1 for state in states if state.health_point and state.health_point < 25)

        return {
            "total_devices": total_devices,
            "average_health": round(average_health, 2),
            "healthy_devices": healthy_devices,
            "critical_devices": critical_devices,
        }

    @staticmethod
    def get_device_location_health(db: Session, city: str):
        """
        Recupera el estado de salud de los dispositivos en una ciudad específica.

        :param db: Sesión de base de datos SQLAlchemy.
        :param city: Ciudad para filtrar los dispositivos.
        :return: Lista de diccionarios con la información de salud de los dispositivos en la ciudad.
        """
        devices_in_city = (
            db.query(DeviceInfo)
            .filter(DeviceInfo.city == city)
            .all()
        )

        device_sns = [device.sn for device in devices_in_city]
        states = (
            db.query(FibcabDevState)
            .filter(FibcabDevState.sn.in_(device_sns))
            .all()
        )

        health_data = [
            {
                "sn": state.sn,
                "health_point": state.health_point,
                "warnings": state.warnings,
                "crisis": state.crisis,
                "warnlog_url": state.warnlog_url,
                "crislog_url": state.crislog_url,
                "rawfile_url": state.rawfile_url,
            }
            for state in states
        ]
        return health_data