// loadComponents.js
import { loadComponent } from "./loadComponent.js";
// Cargar el header
loadComponent("./pages/components/header.html", "header-container");

// Cargar el footer
loadComponent("./pages/components/footer.html", "footer-container");

// Función para cargar un archivo HTML en un contenedor
// Solo definir la función una vez
export function loadComponent(url, containerId) {
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById(containerId).innerHTML = html;
    })
    .catch((error) => {
      console.warn("Error al cargar el componente:", error);
    });
}
