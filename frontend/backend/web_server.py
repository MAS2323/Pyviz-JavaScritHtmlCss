import http.server
import socketserver

def run_web_server(port=8000):
    """
    Inicia un servidor web para servir archivos HTML y JSON.
    
    Args:
        port (int): Puerto en el que se ejecutará el servidor.
    """
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Servidor web iniciado en http://localhost:{port}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_web_server()