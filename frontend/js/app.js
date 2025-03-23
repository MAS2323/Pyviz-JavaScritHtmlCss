import { initializeViewer } from "./helpers/cesiumSetup.js";

document.addEventListener("DOMContentLoaded", () => {
  const viewer = initializeViewer();
  if (viewer) {
    // Ahora puedes usar el 'viewer' aquí en este componente
    console.log("Viewer cargado y listo para usar");
  }
});
