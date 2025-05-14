# cpu/plotter.py
import matplotlib.pyplot as plt
import io
import base64

def generate_cpu_plot(cpu_usage):
    plt.figure(figsize=(8, 4))
    plt.plot(cpu_usage, marker='o', color='#4E79A7')
    plt.title("Uso de CPU durante la ejecución")
    plt.xlabel("Intervalos")
    plt.ylabel("Uso (%)")
    plt.grid(True)
    plt.ylim(0, 100)

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')