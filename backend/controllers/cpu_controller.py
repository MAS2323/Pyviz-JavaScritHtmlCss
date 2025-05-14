# controllers/cpu_controller.py
import psutil
import time
import subprocess
from schemas.cpu_schemas import CPUMeasurementResponse
from cpu.monitor import measure_cpu_usage_during
from cpu.plotter import generate_cpu_plot


def run_simulation_task():
    """
    Simula una tarea intensiva como una simulación SDH.
    Reemplaza esto con una llamada real a OMNeT++ o PyViz.
    """
    total = 0
    for i in range(10_000_000):
        total += i
    return {"result": total}


def measure_cpu_load():
    result, cpu_usage = measure_cpu_usage_during(run_simulation_task)

    avg_cpu = sum(cpu_usage) / len(cpu_usage)
    max_cpu = max(cpu_usage)
    plot_b64 = generate_cpu_plot(cpu_usage)

    return CPUMeasurementResponse(
        task_result=result,
        cpu_usage=cpu_usage,
        max_cpu_usage=max_cpu,
        avg_cpu_usage=avg_cpu,
        cpu_usage_plot=plot_b64
    )