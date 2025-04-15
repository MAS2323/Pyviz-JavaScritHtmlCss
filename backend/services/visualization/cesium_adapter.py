def generate_cesium_config(geojson_data):
    """Convierte GeoJSON a configuración CZML para CesiumJS"""
    czml = [{
        "id": "document",
        "version": "1.0",
        "name": "SDH Network Visualization"
    }]
    
    for feature in geojson_data['features']:
        if feature['geometry']['type'] == 'Point':
            czml.append({
                "id": feature['properties']['sn'],
                "name": feature['properties'].get('name', ''),
                "position": {
                    "cartographicDegrees": list(feature['geometry']['coordinates']) + [0]
                },
                "point": {
                    "color": {"rgba": [0, 255, 255, 255]},
                    "pixelSize": 10
                }
            })
        elif feature['geometry']['type'] == 'LineString':
            czml.append({
                "id": f"conn_{feature['properties']['source_sn']}_{feature['properties']['target_sn']}",
                "polyline": {
                    "positions": {
                        "cartographicDegrees": [
                            coord for pair in feature['geometry']['coordinates'] for coord in pair
                        ] + [0, 0]
                    },
                    "width": 3,
                    "material": {"solidColor": {"color": {"rgba": [255, 0, 0, 200]}}}
                }
            })
    
    return czml