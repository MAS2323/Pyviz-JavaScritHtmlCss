import pandas as pd
import holoviews as hv
import panel as pn
from sqlalchemy.orm import Session
from models.iolp_models import IolpDevState
from models.device_info import DeviceInfo

hv.extension('bokeh')

def create_performance_dashboard(db: Session):
    # Obtener datos de rendimiento
    states = db.query(IolpDevState).all()
    devices = {d.sn: d for d in db.query(DeviceInfo).all()}
    
    # Preparar datos
    perf_data = []
    for state in states:
        device = devices.get(state.sn)
        if device and state.opt_pow_mean is not None:
            perf_data.append({
                "sn": state.sn,
                "recordId": state.recordId,
                "power_mean": state.opt_pow_mean,
                "power_var": state.opt_pow_var,
                "location": device.location,
                "timestamp": state.timestamp  # Asume que tienes este campo
            })
    
    df = pd.DataFrame(perf_data)
    
    # 1. Serie temporal de potencia media
    power_ts = hv.Curve(
        df, 'timestamp', 'power_mean'
    ).opts(
        title="Rendimiento Óptico Promedio",
        width=800,
        ylabel="Potencia (dBm)",
        tools=['hover']
    )
    
    # 2. Variación de potencia por ubicación
    power_var = hv.BoxWhisker(
        df, 'location', 'power_var'
    ).opts(
        title="Variación de Potencia por Ubicación",
        width=600,
        xrotation=45,
        ylabel="Variación (dBm)"
    )
    
    # 3. Correlación entre media y varianza
    scatter = hv.Scatter(
        df, 'power_mean', 'power_var'
    ).opts(
        title="Correlación Potencia Media vs Varianza",
        width=400,
        height=400,
        tools=['hover']
    )
    
    # Dashboard completo
    dashboard = pn.Column(
        pn.Row(power_ts),
        pn.Row(power_var, scatter),
        sizing_mode='stretch_width'
    )
    
    return dashboard