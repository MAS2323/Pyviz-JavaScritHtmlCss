import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend
import matplotlib.pyplot as plt
import base64
from io import BytesIO

def generate_cpu_plot(cpu_usage):
    plt.figure(figsize=(8, 4))
    plt.plot(cpu_usage, label='CPU Usage (%)', color='#00c4ff')
    plt.xlabel('Time (s)')
    plt.ylabel('CPU Usage (%)')
    plt.title('CPU Usage Over Time')
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.7)

    # Save plot to a BytesIO buffer
    buffer = BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight')
    buffer.seek(0)
    plot_b64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close()  # Close the figure to free memory
    buffer.close()

    return plot_b64