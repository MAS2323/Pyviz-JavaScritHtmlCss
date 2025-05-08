from pydantic import BaseModel, computed_field, Field
from typing import List, Dict, Any
from datetime import datetime
import base64

# Esquema base para entrada de control frame
class ControlFrameBase(BaseModel):
    cmdFlg: int = Field(..., description="Identificador del tipo de mensaje (1=ida, 2=vuelta, 3=SDH, 4=IOLP, 5=jmpmat, 6=fibcab, 128-135=reset reports, 176-182=events)")
    gId: int = Field(..., description="ID del dispositivo receptor")
    param: int = Field(..., description="Parámetro o Tag del mensaje")

# Esquemas para valores específicos
class ValuesTraffStub(BaseModel):
    txPkgSn_Reset: int = Field(..., ge=0, le=255, description="Reset del contador de paquetes enviados")
    rxPkgNum_Reset: int = Field(..., ge=0, le=255, description="Reset del contador de paquetes recibidos")
    txPkgRate: float = Field(..., description="Tasa de envío de paquetes")
    tx2gId: int = Field(..., ge=0, description="ID del dispositivo destino")

class ValuesSDH(BaseModel):
    txTrfNum_Reset: int = Field(..., ge=0, le=255, description="Reset del módulo de envío")
    rxTrfNum_Reset: int = Field(..., ge=0, le=255, description="Reset del módulo de recepción")
    obrdNum: int = Field(..., ge=0, le=255, description="Número de placas ópticas")
    sdhMap: List[int] = Field(..., min_items=9, max_items=9, description="Mapa de configuración de puertos")

class ValuesIOLP(BaseModel):
    actPairs: int = Field(..., ge=0, le=255, description="Número de pares de conexión activos")
    pairMap: List[int] = Field(..., min_items=16, max_items=16, description="Mapa de conexiones activas")

class ValuesJmpmat(BaseModel):
    actNum: int = Field(..., ge=0, le=255, description="Número de conexiones activas")
    actMap: List[int] = Field(..., min_items=32, max_items=32, description="Mapa de conexiones activas")

class ValuesFibcab(BaseModel):
    enableFlg: int = Field(..., ge=0, le=255, description="Flag de habilitación")

class ValuesFibcabEvent(BaseModel):
    brkNum: int = Field(..., ge=0, le=255, description="Número de fibras interrumpidas")
    brkBitMap: int = Field(..., ge=0, description="BitMap de fibras interrumpidas")

class ValuesFibcabReport(BaseModel):
    brkNum: int = Field(..., ge=0, le=255, description="Número de fibras interrumpidas")
    brkBitMap: int = Field(..., ge=0, description="BitMap de fibras interrumpidas")

# Esquema para mensajes con Length=0 (reset reports y eventos sin valores)
class ValuesEmpty(BaseModel):
    pass

# Esquema para crear un control frame
class ControlFrameCreate(ControlFrameBase):
    values: Dict[str, Any] = Field(..., description="Valores específicos según cmdFlg")

# Esquema para respuesta
class ControlFrameResponse(ControlFrameBase):
    id: int = Field(..., description="ID del frame en la base de datos")
    length: int = Field(..., description="Longitud del campo values en bytes")
    values: bytes = Field(..., description="Datos binarios del campo values", exclude=True)
    timestamp: datetime = Field(..., description="Fecha y hora de creación")

    @computed_field
    @property
    def values_base64(self) -> str:
        if self.values is None:
            return ""
        return base64.b64encode(self.values).decode('utf-8')

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True