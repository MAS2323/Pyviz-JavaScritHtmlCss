import pandas as pd
import geopandas as gpd
from geojson import Feature, FeatureCollection, Point, LineString

def df_to_geojson(df, point_properties=None, line_properties=None):
    """Convierte DataFrame a GeoJSON FeatureCollection"""
    features = []
    
    if point_properties:
        for _, row in df.iterrows():
            if pd.notna(row['longitude']) and pd.notna(row['latitude']):
                point = Point((row['longitude'], row['latitude']))
                props = {prop: row[prop] for prop in point_properties if prop in row}
                features.append(Feature(geometry=point, properties=props))
    
    if line_properties:
        for _, row in df.iterrows():
            if all(pd.notna(row.get(coord, None)) for coord in ['lon1', 'lat1', 'lon2', 'lat2']):
                line = LineString([(row['lon1'], row['lat1']), (row['lon2'], row['lat2'])])
                props = {prop: row[prop] for prop in line_properties if prop in row}
                features.append(Feature(geometry=line, properties=props))
    
    return FeatureCollection(features)