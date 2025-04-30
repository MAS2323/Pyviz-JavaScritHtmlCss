from sqlalchemy import create_engine
import pandas as pd

def fetch_data_from_mysql(host, user, password, database, table_name):
    """
    Conecta a una base de datos MySQL y extrae datos geoespaciales.

    Args:
        host (str): Host de la base de datos.
        user (str): Usuario de la base de datos.
        password (str): Contraseña de la base de datos.
        database (str): Nombre de la base de datos.
        table_name (str): Nombre de la tabla que contiene los datos.

    Returns:
        pd.DataFrame: DataFrame con los datos extraídos.
    """
    # Crear una conexión a la base de datos usando SQLAlchemy
    try:
        engine = create_engine(f"mysql+pymysql://{user}:{password}@{host}/{database}")
        query = f"SELECT latitude, longitude, altitude FROM {table_name};"
        data = pd.read_sql(query, engine)
        print("Datos extraídos correctamente de la base de datos.")
        return data
    except Exception as e:
        print(f"Error al conectar o extraer datos de la base de datos: {e}")
        return None

def save_data_to_json(data, output_file='data/data.json'):
    """
    Guarda los datos en un archivo JSON.

    Args:
        data (pd.DataFrame): Datos a guardar.
        output_file (str): Ruta del archivo JSON de salida.
    """
    if data is not None and not data.empty:
        try:
            data.to_json(output_file, orient='records')
            print(f"Datos guardados en '{output_file}'.")
        except Exception as e:
            print(f"Error al guardar los datos en JSON: {e}")
    else:
        print("No hay datos para guardar.")

if __name__ == "__main__":
    # Configuración de la base de datos
    HOST = "localhost"   # Cambia esto si tu base de datos está en otro servidor
    USER = "root"  # Tu usuario de MySQL
    PASSWORD = "2323mas"  # Tu contraseña de MySQL
    DATABASE = "system_sdh2"  # Nombre de tu base de datos
    TABLE = "geospatial_data"  # Nombre de la tabla que contiene los datos

    # Extraer datos de MySQL
    data = fetch_data_from_mysql(HOST, USER, PASSWORD, DATABASE, TABLE)

    # Guardar los datos en un archivo JSON
    save_data_to_json(data)