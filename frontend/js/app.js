import { initializeViewer } from "./helpers/cesiumSetup.js";
import { fetchAllDevices, fetchFibcabsForDevice } from "./helpers/api.js";
import { renderDevices } from "./components/deviceRenderer.js";
import { renderFibcabs } from "./components/fibcabRenderer.js";
import { setupClickEvents } from "./components/popupHandler.js";
import { setupBaseLayerToggle } from "./components/baseLayerHandler.js";
import { showSdhPopup } from "./components/sdhHandler.js";

document.addEventListener("DOMContentLoaded", async () => {
  const viewer = initializeViewer();
  if (!viewer) return;

  try {
    // Cargar todos los dispositivos
    const devices = await fetchAllDevices();

    // Renderizar dispositivos (nodos)
    renderDevices(viewer, devices);

    // Renderizar fibras asociadas con cada dispositivo
    for (const device of devices) {
      const fibcabs = await fetchFibcabsForDevice(device.sn);
      if (fibcabs.length > 0) {
        renderFibcabs(viewer, fibcabs, devices);
      } else {
        console.warn(`No fibcabs found for device SN ${device.sn}`);
      }
    }

    // Configurar eventos de clic para mostrar popups
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    handler.setInputAction((click) => {
      const pickedObject = viewer.scene.pick(click.position);

      if (
        Cesium.defined(pickedObject) &&
        pickedObject.id &&
        pickedObject.id.data
      ) {
        const device = pickedObject.id.data;

        // Mostrar el popup de información de SDH
        showSdhPopup(device.sn);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Configurar el cambio de capa base
    setupBaseLayerToggle(viewer);

    // Configurar eventos de clic adicionales
    setupClickEvents(viewer, devices);
  } catch (error) {
    console.error("Error al cargar o renderizar datos:", error);
  }

  console.log("Viewer cargado y listo para usar");
});
