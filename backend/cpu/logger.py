import csv
from datetime import datetime

def save_cpu_usage_to_csv(cpu_usage_data, filename=None):
    if not filename:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"cpu_usage_{timestamp}.csv"
    
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Tiempo (segundos)', 'Uso de CPU (%)'])
        for i, usage in enumerate(cpu_usage_data):
            writer.writerow([i+1, usage])
    print(f"[Logger] Datos de CPU guardados en: {filename}")
    return filename