from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routers.sdh_router import sdh_router
from routers.iolp_router import iolp_router
from routers.fibcab_router import fibcab_router
from routers.dev_info_router import dev_info_router
from routers.traffstub_router import traffstub_router
from routers.jmpmat_router import jmpmat_router
from routers.pyviz_router import pyviz_router
from routers.control_frame_router import control_frame_router
from routers.tianditu_proxy import router as tianditu_router
from routers.user_router import users_router
from routers.cpu_router import cpu_router
from database import Base, engine

# Crear todas las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configurar CORS para permitir solicitudes desde el frontend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"],
)

# Incluir todos los routers
app.include_router(fibcab_router)
app.include_router(iolp_router)
app.include_router(jmpmat_router)
app.include_router(sdh_router)
app.include_router(traffstub_router)
app.include_router(dev_info_router)
app.include_router(pyviz_router)
app.include_router(control_frame_router)
app.include_router(tianditu_router)
app.include_router(users_router)
app.include_router(cpu_router)
# Ruta de bienvenida
@app.get("/")
def read_root():
    return {"message": "Bienvenido al sistema SDH!"}