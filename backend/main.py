from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routers.sdh_router import sdh_router
from routers.iolp_router import iolp_router
from routers.fibcab_router import fibcab_router
from routers.dev_info_router import dev_info_router
from routers.traffstub_router import traffstub_router
from routers.jmpmat_router import jmpmat_router
from routers.pyviz_router import pyviz_router
from database import Base, engine

# Crear la aplicación FastAPI
Base.metadata.create_all(bind=engine)
app = FastAPI()

origins = [
    "http://127.0.0.1:5500",  # Origen del frontend
    "http://localhost:5173",
]
# Configurar el middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Permitir credenciales (cookies, headers de autenticación)
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Métodos HTTP permitidos
    allow_headers=["Content-Type", "Authorization"],  # Headers permitidos
)

# Montar los routers
app.include_router(fibcab_router)
app.include_router(iolp_router)
app.include_router(jmpmat_router)
app.include_router(sdh_router)
app.include_router(traffstub_router)
app.include_router(dev_info_router)
app.include_router(pyviz_router)
# Ruta de bienvenida
@app.get("/")
def read_root():
    return {"message": "Bienvenido al sistema SDH!"}

