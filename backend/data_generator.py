import numpy as np
import pandas as pd

def generate_geospatial_data(num_points=100, output_file='data.json'):
    """
    Genera datos geoespaciales aleatorios y los guarda en un archivo JSON.
    
    Args:
        num_points (int): Número de puntos a generar.
        output_file (str): Nombre del archivo JSON de salida.
    """
    np.random.seed(42)
    latitudes = np.random.uniform(-90, 90, num_points)
    longitudes = np.random.uniform(-180, 180, num_points)
    altitudes = np.random.uniform(0, 1000, num_points)

    data = pd.DataFrame({
        'latitude': latitudes,
        'longitude': longitudes,
        'altitude': altitudes
    })

    data.to_json(output_file, orient='records')
    print(f"Datos generados y guardados en '{output_file}'.")

if __name__ == "__main__":
    generate_geospatial_data()