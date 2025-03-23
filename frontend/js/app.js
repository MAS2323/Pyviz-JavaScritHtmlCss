import { initializeViewer } from "./helpers/cesiumSetup.js";
import { fetchAllDevices, fetchFibcab } from "./helpers/api.js";
import { renderDevices } from "./components/deviceRenderer.js";
import { renderFibcabs } from "./components/fibcabRenderer.js";
import { setupClickEvents } from "./components/popupHandler.js";

document.addEventListener("DOMContentLoaded", async () => {
  const viewer = initializeViewer();
  if (!viewer) return;

  try {
    // Cargar todos los dispositivos
    const devices = await fetchAllDevices();

    // Renderizar dispositivos (nodos)
    renderDevices(viewer, devices);

    // Cargar y renderizar fibras para cada dispositivo
    for (const device of devices) {
      const fibcab = await fetchFibcab(device.sn);
      if (fibcab) {
        renderFibcabs(viewer, [fibcab], devices);
      } else {
        console.warn(`No fibcab found for device SN ${device.sn}`);
      }
    }

    // Configurar eventos de clic para mostrar popups
    setupClickEvents(viewer);
  } catch (error) {
    console.error("Error al cargar o renderizar datos:", error);
  }

  console.log("Viewer cargado y listo para usar");
});
