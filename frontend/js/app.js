import { initializeViewer } from "./helpers/cesiumSetup.js";
import { fetchAllDevices, fetchFibcabsForDevice } from "./helpers/api.js";
import { renderDevices } from "./components/deviceRenderer.js";
import { renderFibcabs } from "./components/fibcabRenderer.js";
import { setupClickEvents } from "./components/popupHandler.js";

document.addEventListener("DOMContentLoaded", async () => {
  const viewer = initializeViewer();
  if (!viewer) return;

  try {
    const devices = await fetchAllDevices();
    renderDevices(viewer, devices);
    for (const device of devices) {
      const fibcabs = await fetchFibcabsForDevice(device.sn);
      if (fibcabs.length > 0) {
        renderFibcabs(viewer, fibcabs, devices);
      } else {
        console.warn(`No fibcabs found for device SN ${device.sn}`);
      }
    }

    setupClickEvents(viewer, devices);
  } catch (error) {
    console.error("Error al cargar o renderizar datos:", error);
  }

  console.log("Viewer cargado y listo para usar");
});
