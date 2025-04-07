from sqlalchemy.orm import Session
from models.device_info import DeviceInfo
import pandas as pd
import geopandas as gpd
import datashader as ds
import datashader.transfer_functions as tf
from colorcet import fire
from geojson import Feature, FeatureCollection, Point

def process_device_data_with_pyviz(db: Session):
    # Consulta los datos desde la base de datos
    devices = db.query(DeviceInfo).all()

    # Convertir los datos a un DataFrame de Pandas
    data = [
        {
            "sn": device.sn,
            "name": device.name,
            "city": device.city,
            "longitude": device.longitude,
            "latitude": device.lattitude,
        }
        for device in devices
    ]
    df = pd.DataFrame(data)

    # Crear un GeoDataFrame
    gdf = gpd.GeoDataFrame(
        df,
        geometry=gpd.points_from_xy(df["longitude"], df["latitude"]),
        crs="EPSG:4326"
    )

    # Usar Datashader para calcular la densidad de puntos
    canvas = ds.Canvas(plot_width=800, plot_height=600)
    agg = canvas.points(gdf, 'longitude', 'latitude')
    img = tf.shade(agg, cmap=fire)

    # Exportar los datos a GeoJSON
    features = []
    for _, row in gdf.iterrows():
        point = Point((row["longitude"], row["latitude"]))
        feature = Feature(geometry=point, properties={"name": row["name"], "city": row["city"]})
        features.append(feature)

    feature_collection = FeatureCollection(features)
    return feature_collection