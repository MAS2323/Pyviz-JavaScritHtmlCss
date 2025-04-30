from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # Importa el middleware CORS
from pydantic import BaseModel
from sqlalchemy import create_engine, Table, MetaData, Column, Float, Integer
from sqlalchemy.exc import SQLAlchemyError
import pandas as pd

# Definir el modelo Pydantic para validar los datos entrantes
class GeoData(BaseModel):
    latitude: float
    longitude: float
    altitude: float

# Configuración de la base de datos
DATABASE_URI = "mysql+pymysql://root:2323mas@localhost/system_sdh2"
engine = create_engine(DATABASE_URI)
metadata = MetaData()

# Definir la tabla geospatial_data
geospatial_data = Table(
    'geospatial_data', metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('latitude', Float, nullable=False),
    Column('longitude', Float, nullable=False),
    Column('altitude', Float, nullable=False)
)

# Crear la tabla si no existe
metadata.create_all(bind=engine)

# Inicializar FastAPI
app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas las origenes (ajusta según sea necesario)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/send_data")
async def send_data(data: GeoData):
    """
    Endpoint para recibir datos de OMNeT++ y almacenarlos en la base de datos.
    """
    try:
        # Insertar los datos en la base de datos
        insert_query = geospatial_data.insert().values(
            latitude=data.latitude,
            longitude=data.longitude,
            altitude=data.altitude
        )
        with engine.connect() as connection:
            connection.execute(insert_query)

        return {"message": "Datos almacenados correctamente"}

    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Error al almacenar los datos: {str(e)}")

@app.get("/get_data")
async def get_data():
    """
    Endpoint para obtener los datos geoespaciales y enviarlos al frontend.
    """
    try:
        query = f"SELECT latitude, longitude, altitude FROM geospatial_data;"
        data = pd.read_sql(query, engine)
        if data.empty:
            return {"message": "No hay datos disponibles"}
        return data.to_dict(orient="records")  # Devuelve los datos como una lista de diccionarios
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener los datos: {str(e)}")