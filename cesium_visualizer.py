def create_cesium_html(data_file='data/data.json', template_file='templates/index.html', output_file='templates/index.html'):
    """
    Crea un archivo HTML con CesiumJS que carga datos desde un archivo JSON.
    
    Args:
        data_file (str): Ruta al archivo JSON con los datos geoespaciales.
        template_file (str): Ruta a la plantilla HTML.
        output_file (str): Nombre del archivo HTML de salida.
    """
    with open(template_file, 'r') as file:
        template = file.read()

    # Reemplazar el placeholder {{ data_file }} con la ruta real del archivo JSON
    html_content = template.replace('{{ data_file }}', data_file)

    with open(output_file, 'w') as file:
        file.write(html_content)

    print(f"Archivo HTML generado: '{output_file}'.")

if __name__ == "__main__":
    create_cesium_html()