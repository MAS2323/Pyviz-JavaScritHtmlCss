# routers/cpu_router.py
from fastapi import APIRouter, Depends
from controllers.cpu_controller import measure_cpu_load

cpu_router = APIRouter(prefix="/cpu", tags=["CPU Usage"])

@cpu_router.get("/measure")
def get_cpu_measurement():
    return measure_cpu_load()