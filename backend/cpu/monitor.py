# cpu/monitor.py
import psutil
import time
import threading

def measure_cpu_usage_during(callback, interval=0.1, *args, **kwargs):
    
    cpu_usage = []

    def monitor():
        while running:
            cpu = psutil.cpu_percent(interval=interval)
            cpu_usage.append(cpu)
            time.sleep(0.1)

    global running
    running = True

    thread = threading.Thread(target=monitor)
    thread.start()

    result = callback(*args, **kwargs)

    running = False
    thread.join(timeout=10)

    return result, cpu_usage