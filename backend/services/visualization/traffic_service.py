import pandas as pd
import holoviews as hv
import panel as pn
from holoviews import dim
from sqlalchemy.orm import Session
from models.traffstub_models import TraffstubDevState
from models.traffstub_models import TraffstubDevConfig

hv.extension('bokeh')

def create_traffic_analysis(db: Session):
    # Obtener datos de tráfico y configuración
    states = db.query(TraffstubDevState).all()
    configs = {c.sn: c for c in db.query(TraffstubDevConfig).all()}
    
    # Preparar datos usando recordId como pseudo-timestamp si timestamp no existe
    traffic_data = []
    for state in states:
        config = configs.get(state.sn, None)
        traffic_data.append({
            "sn": state.sn,
            "recordId": state.recordId,  # Usamos recordId como identificador temporal
            "tx_rate": state.txer_pkgrate if hasattr(state, 'txer_pkgrate') else None,
            "rx_rate": state.rxer_pkgrate if hasattr(state, 'rxer_pkgrate') else None,
            "health": state.health_point if hasattr(state, 'health_point') else None,
            "config_tx_rate": config.txer_pkgrate if config and hasattr(config, 'txer_pkgrate') else None,
            "config_rx_rate": config.rxer_pkgrate if config and hasattr(config, 'rxer_pkgrate') else None
        })
    
    df = pd.DataFrame(traffic_data)
    
    # Limpiar datos - eliminar filas con valores nulos en tasas
    df = df.dropna(subset=['tx_rate', 'rx_rate'])
    
    # Calcular throughput si hay datos válidos
    if not df.empty:
        df['throughput'] = (df['tx_rate'].astype(float) + df['rx_rate'].astype(float)) / 2
    else:
        df['throughput'] = pd.NA
    
    # 1. Serie temporal de tasas de tráfico (usando recordId como eje x)
    traffic_ts = hv.Curve(
        df, 'recordId', 'throughput'
    ).opts(
        title="Evolución del Tráfico (por registro)",
        width=800,
        ylabel="Paquetes/segundo",
        tools=['hover']
    )
    
    # 2. Comparación entre tasas configuradas y reales
    if 'config_tx_rate' in df.columns and 'config_rx_rate' in df.columns:
        comparison = hv.Overlay([
            hv.Scatter(df, 'config_tx_rate', 'tx_rate', label='TX').opts(color='blue'),
            hv.Scatter(df, 'config_rx_rate', 'rx_rate', label='RX').opts(color='green')
        ]).opts(
            title="Configurado vs Real",
            xlabel="Tasa Configurada",
            ylabel="Tasa Real",
            width=400,
            height=400,
            tools=['hover']
        )
    else:
        comparison = hv.Text(0, 0, "No hay datos de configuración").opts(width=400, height=400)
    
    # 3. Correlación TX/RX
    scatter = hv.Scatter(
        df, 'tx_rate', 'rx_rate'
    ).opts(
        title="Correlación TX vs RX",
        width=400,
        height=400,
        tools=['hover']
    )
    
    # Dashboard completo
    dashboard = pn.Column(
        pn.Row(traffic_ts),
        pn.Row(comparison, scatter),
        sizing_mode='stretch_width'
    )
    
    return dashboard