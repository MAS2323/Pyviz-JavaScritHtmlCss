from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.control_frame_model import ControlFrame
import struct
from typing import Dict, Any
import socket

# Configuración para comunicación con hardware (SDH device)
HARDWARE_IP = "192.168.1.100"  # IP del dispositivo SDH
HARDWARE_PORT = 5000  # Puerto del dispositivo SDH

class ValuesHandler:
    @staticmethod
    def serialize_traffstub(values: Dict[str, Any]) -> bytes:
        return struct.pack(
            "!BBdI",
            values["txPkgSn_Reset"],
            values["rxPkgNum_Reset"],
            values["txPkgRate"],
            values["tx2gId"]
        )

    @staticmethod
    def serialize_sdh(values: Dict[str, Any]) -> bytes:
        sdh_map = values["sdhMap"]
        if len(sdh_map) != 9:
            raise ValueError("sdhMap must contain exactly 9 elements")
        return struct.pack(
            "!BBB9B",
            values["txTrfNum_Reset"],
            values["rxTrfNum_Reset"],
            values["obrdNum"],
            *sdh_map
        )

    @staticmethod
    def serialize_iolp(values: Dict[str, Any]) -> bytes:
        pair_map = values["pairMap"]
        if len(pair_map) != 16:
            raise ValueError("pairMap must contain exactly 16 elements")
        return struct.pack(
            "!B16B",
            values["actPairs"],
            *pair_map
        )

    @staticmethod
    def serialize_jmpmat(values: Dict[str, Any]) -> bytes:
        act_map = values["actMap"]
        if len(act_map) != 32:
            raise ValueError("actMap must contain exactly 32 elements")
        return struct.pack(
            "!B32B",
            values["actNum"],
            *act_map
        )

    @staticmethod
    def serialize_fibcab(values: Dict[str, Any]) -> bytes:
        return struct.pack("!B", values["enableFlg"])

    @staticmethod
    def serialize_fibcab_event(values: Dict[str, Any]) -> bytes:
        return struct.pack("!BQ", values["brkNum"], values["brkBitMap"])

    @staticmethod
    def serialize_fibcab_report(values: Dict[str, Any]) -> bytes:
        return struct.pack("!BQ", values["brkNum"], values["brkBitMap"])

    @staticmethod
    def serialize_empty(values: Dict[str, Any]) -> bytes:
        return b""

    @staticmethod
    def deserialize_traffstub(data: bytes) -> Dict[str, Any]:
        if len(data) != 14:
            raise ValueError("Invalid length for traffstub values")
        txPkgSn_Reset, rxPkgNum_Reset, txPkgRate, tx2gId = struct.unpack("!BBdI", data)
        return {
            "txPkgSn_Reset": txPkgSn_Reset,
            "rxPkgNum_Reset": rxPkgNum_Reset,
            "txPkgRate": txPkgRate,
            "tx2gId": tx2gId
        }

    @staticmethod
    def deserialize_sdh(data: bytes) -> Dict[str, Any]:
        if len(data) != 12:
            raise ValueError("Invalid length for SDH values")
        txTrfNum_Reset, rxTrfNum_Reset, obrdNum, *sdhMap = struct.unpack("!BBB9B", data)
        return {
            "txTrfNum_Reset": txTrfNum_Reset,
            "rxTrfNum_Reset": rxTrfNum_Reset,
            "obrdNum": obrdNum,
            "sdhMap": sdhMap
        }

    @staticmethod
    def deserialize_iolp(data: bytes) -> Dict[str, Any]:
        if len(data) != 17:
            raise ValueError("Invalid length for IOLP values")
        actPairs, *pairMap = struct.unpack("!B16B", data)
        return {
            "actPairs": actPairs,
            "pairMap": pairMap
        }

    @staticmethod
    def deserialize_jmpmat(data: bytes) -> Dict[str, Any]:
        if len(data) != 33:
            raise ValueError("Invalid length for jmpmat values")
        actNum, *actMap = struct.unpack("!B32B", data)
        return {
            "actNum": actNum,
            "actMap": actMap
        }

    @staticmethod
    def deserialize_fibcab(data: bytes) -> Dict[str, Any]:
        if len(data) != 1:
            raise ValueError("Invalid length for fibcab values")
        enableFlg = struct.unpack("!B", data)[0]
        return {"enableFlg": enableFlg}

    @staticmethod
    def deserialize_fibcab_event(data: bytes) -> Dict[str, Any]:
        if len(data) != 9:
            raise ValueError("Invalid length for fibcab event values")
        brkNum, brkBitMap = struct.unpack("!BQ", data)
        return {
            "brkNum": brkNum,
            "brkBitMap": brkBitMap
        }

    @staticmethod
    def deserialize_fibcab_report(data: bytes) -> Dict[str, Any]:
        if len(data) != 9:
            raise ValueError("Invalid length for fibcab report values")
        brkNum, brkBitMap = struct.unpack("!BQ", data)
        return {
            "brkNum": brkNum,
            "brkBitMap": brkBitMap
        }

    @staticmethod
    def deserialize_empty(data: bytes) -> Dict[str, Any]:
        if len(data) != 0:
            raise ValueError("Expected empty values")
        return {}

    @classmethod
    def serialize(cls, cmdFlg: int, values: Dict[str, Any]) -> bytes:
        handlers = {
            2: cls.serialize_traffstub,
            3: cls.serialize_sdh,
            4: cls.serialize_iolp,
            5: cls.serialize_jmpmat,
            6: cls.serialize_fibcab,
            182: cls.serialize_fibcab_event,
            135: cls.serialize_fibcab_report,
            128: cls.serialize_empty,
            129: cls.serialize_empty,
            130: cls.serialize_empty,
            131: cls.serialize_empty,
            132: cls.serialize_empty,
            133: cls.serialize_empty,
            134: cls.serialize_empty,
            176: cls.serialize_empty,
            177: cls.serialize_empty,
            178: cls.serialize_empty,
            179: cls.serialize_empty,
            180: cls.serialize_empty,
            181: cls.serialize_empty,
        }
        handler = handlers.get(cmdFlg)
        if not handler:
            raise ValueError(f"Unsupported cmdFlg: {cmdFlg}")
        return handler(values)

    @classmethod
    def deserialize(cls, cmdFlg: int, data: bytes) -> Dict[str, Any]:
        handlers = {
            2: cls.deserialize_traffstub,
            3: cls.deserialize_sdh,
            4: cls.deserialize_iolp,
            5: cls.deserialize_jmpmat,
            6: cls.deserialize_fibcab,
            182: cls.deserialize_fibcab_event,
            135: cls.deserialize_fibcab_report,
            128: cls.deserialize_empty,
            129: cls.deserialize_empty,
            130: cls.deserialize_empty,
            131: cls.deserialize_empty,
            132: cls.deserialize_empty,
            133: cls.deserialize_empty,
            134: cls.deserialize_empty,
            176: cls.deserialize_empty,
            177: cls.deserialize_empty,
            178: cls.deserialize_empty,
            179: cls.deserialize_empty,
            180: cls.deserialize_empty,
            181: cls.deserialize_empty,
        }
        handler = handlers.get(cmdFlg)
        if not handler:
            raise ValueError(f"Unsupported cmdFlg: {cmdFlg}")
        return handler(data)

def send_to_hardware(cmdFlg: int, gId: int, param: int, values: bytes):
    try:
        # Construir el paquete: cmdFlg (2 bytes) | gId (4 bytes) | param (2 bytes) | length (2 bytes) | values
        length = len(values)
        packet = struct.pack("!HIHH", cmdFlg, gId, param, length) + values

        # Enviar paquete via UDP
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.sendto(packet, (HARDWARE_IP, HARDWARE_PORT))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send to hardware: {str(e)}")

def create_control_frame(db: Session, frame_data: Dict[str, Any]) -> ControlFrame:
    try:
        values_bytes = ValuesHandler.serialize(frame_data["cmdFlg"], frame_data["values"])
        frame = ControlFrame(
            cmdFlg=frame_data["cmdFlg"],
            gId=frame_data["gId"],
            param=frame_data["param"],
            length=len(values_bytes),
            values=values_bytes
        )
        db.add(frame)
        db.commit()
        db.refresh(frame)

        # Enviar al hardware (solo para configuración, no reportes)
        if frame.cmdFlg < 128:  # cmdFlg < 128 son mensajes de configuración
            send_to_hardware(frame.cmdFlg, frame.gId, frame.param, frame.values)

        return frame
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

def receive_control_frame(db: Session, data: bytes) -> ControlFrame:
    try:
        if len(data) < 10:
            raise ValueError("Invalid control frame length")
        cmdFlg, gId, param, length = struct.unpack("!HIHH", data[:10])
        values = data[10:10 + length]
        if len(values) != length:
            raise ValueError("Values length does not match specified length")
        frame = ControlFrame(
            cmdFlg=cmdFlg,
            gId=gId,
            param=param,
            length=length,
            values=values
        )
        db.add(frame)
        db.commit()
        db.refresh(frame)
        return frame
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

def get_control_frames(db: Session, skip: int = 0, limit: int = 100) -> list[ControlFrame]:
    return db.query(ControlFrame).offset(skip).limit(limit).all()