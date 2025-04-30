export const showPopup = (device, clickPosition) => {
  const popup = document.getElementById("nodePopup");
  const nodeName = document.getElementById("nodeName");
  const nodeCity = document.getElementById("nodeCity");
  const nodeLocation = document.getElementById("nodeLocation");
  const nodeProducer = document.getElementById("nodeProducer");

  nodeName.textContent = device.name || "N/A";
  nodeCity.textContent = device.city || "N/A";
  nodeLocation.textContent = device.location || "N/A";
  nodeProducer.textContent = device.Producer || "N/A";

  // Position the popup near the click
  if (clickPosition) {
    popup.style.left = `${clickPosition.x + 10}px`;
    popup.style.top = `${clickPosition.y + 10}px`;
  }

  popup.classList.remove("hidden");

  document.getElementById("closePopup").onclick = () => {
    popup.classList.add("hidden");
  };
};

// Mostrar el popup de información del nodo
export const showNodePopup = (device) => {
  const popup = document.getElementById("nodePopup");
  const nodeName = document.getElementById("nodeName");
  const nodeCity = document.getElementById("nodeCity");
  const nodeLocation = document.getElementById("nodeLocation");
  const nodeProducer = document.getElementById("nodeProducer");

  // Llenar el contenido del popup
  nodeName.textContent = device.name || "N/A";
  nodeCity.textContent = device.city || "N/A";
  nodeLocation.textContent = device.location || "N/A";
  nodeProducer.textContent = device.Producer || "N/A";

  // Mostrar el popup
  popup.classList.remove("hidden");
  popup.classList.add("visible");

  // Cerrar el popup al hacer clic en el botón "Close"
  document.getElementById("closeNodePopup").onclick = () => {
    popup.classList.add("hidden");
    popup.classList.remove("visible");
  };
};
// Mostrar el popup de información de fibcab
// export const showFibcabPopup = async (sn) => {
//   const popup = document.getElementById("fibcabPopup");
//   const content = document.getElementById("fibcabContent");

//   try {
//     // Obtener datos de fibcab_dev_info
//     const fibcabInfoResponse = await fetch(
//       `http://127.0.0.1:8000/fibcab/dev-info/${sn}`
//     );
//     const fibcabInfo = await fibcabInfoResponse.json();

//     // Obtener datos de fibcab_dev_config
//     const fibcabConfigResponse = await fetch(
//       `http://127.0.0.1:8000/fibcab/dev-config/${sn}`
//     );
//     const fibcabConfig = await fibcabConfigResponse.json();

//     // Obtener datos de fibcab_dev_state
//     const fibcabStateResponse = await fetch(
//       `http://127.0.0.1:8000/fibcab/dev-state/${sn}`
//     );
//     const fibcabState = await fibcabStateResponse.json();

//     // Construir el contenido del popup
//     content.innerHTML = `
//       <h4>Fibcab Dev Info</h4>
//       <pre>${JSON.stringify(fibcabInfo, null, 2)}</pre>
//       <h4>Fibcab Dev Config</h4>
//       <pre>${JSON.stringify(fibcabConfig, null, 2)}</pre>
//       <h4>Fibcab Dev State</h4>
//       <pre>${JSON.stringify(fibcabState, null, 2)}</pre>
//     `;
//   } catch (error) {
//     content.innerHTML = `<p>Error loading fibcab data: ${error.message}</p>`;
//   }

//   // Mostrar el popup
//   popup.classList.remove("hidden");

//   // Cerrar el popup al hacer clic en el botón "Close"
//   document.getElementById("closeFibcabPopup").onclick = () => {
//     popup.classList.add("hidden");
//   };
// };
export const showFibcabPopup = async (sn) => {
  const popup = document.getElementById("fibcabPopup");
  const content = document.getElementById("fibcabContent");

  try {
    // Obtener datos de fibcab_dev_info
    const fibcabInfoResponse = await fetch(
      `http://127.0.0.1:8000/fibcab/dev-info/${sn}`
    );
    if (!fibcabInfoResponse.ok) {
      throw new Error(
        `Error fetching fibcab info: ${fibcabInfoResponse.status}`
      );
    }
    const fibcabInfo = await fibcabInfoResponse.json();

    // Obtener datos de fibcab_dev_config
    const fibcabConfigResponse = await fetch(
      `http://127.0.0.1:8000/fibcab/dev-config/${sn}`
    );
    if (!fibcabConfigResponse.ok) {
      throw new Error(
        `Error fetching fibcab config: ${fibcabConfigResponse.status}`
      );
    }
    const fibcabConfig = await fibcabConfigResponse.json();

    // Obtener datos de fibcab_dev_state
    const fibcabStateResponse = await fetch(
      `http://127.0.0.1:8000/fibcab/dev-state/${sn}`
    );
    if (!fibcabStateResponse.ok) {
      throw new Error(
        `Error fetching fibcab state: ${fibcabStateResponse.status}`
      );
    }
    const fibcabState = await fibcabStateResponse.json();

    // Construir el contenido del popup
    content.innerHTML = `
      <h4>Fibcab Dev Info</h4>
      <pre>${JSON.stringify(fibcabInfo, null, 2)}</pre>
      <h4>Fibcab Dev Config</h4>
      <pre>${JSON.stringify(fibcabConfig, null, 2)}</pre>
      <h4>Fibcab Dev State</h4>
      <pre>${JSON.stringify(fibcabState, null, 2)}</pre>
    `;
  } catch (error) {
    content.innerHTML = `<p>Error loading fibcab data: ${error.message}</p>`;
  }

  // Mostrar el popup
  popup.classList.remove("hidden");
  popup.classList.add("visible");

  // Cerrar el popup al hacer clic en el botón "Close"
  document.getElementById("closeFibcabPopup").onclick = () => {
    popup.classList.add("hidden");
    popup.classList.remove("visible");
  };
};
// Configurar eventos de clic en entidades
// export const setupClickEvents = (viewer, devices) => {
//   const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

//   handler.setInputAction((click) => {
//     const pickedObject = viewer.scene.pick(click.position);

//     if (
//       Cesium.defined(pickedObject) &&
//       pickedObject.id &&
//       pickedObject.id.data
//     ) {
//       const device = pickedObject.id.data;

//       // Mostrar el popup de información del nodo
//       showNodePopup(device);

//       // Mostrar el popup de información de fibcab
//       showFibcabPopup(device.sn);
//     } else {
//       // Ocultar los popups si no se selecciona un nodo
//       document.getElementById("nodePopup").classList.add("hidden");
//       document.getElementById("fibcabPopup").classList.add("hidden");
//     }
//   }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
// };
export const setupClickEvents = (viewer, devices) => {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

  handler.setInputAction((click) => {
    const pickedObject = viewer.scene.pick(click.position);

    if (
      Cesium.defined(pickedObject) &&
      pickedObject.id &&
      pickedObject.id.data
    ) {
      const device = pickedObject.id.data;

      // Mostrar el popup de información del nodo
      showNodePopup(device);

      // Mostrar el popup de información de fibcab
      showFibcabsForDevice(device.sn);
    } else {
      // Ocultar los popups si no se selecciona un nodo
      document.getElementById("nodePopup").classList.add("hidden");
      document.getElementById("fibcabPopup").classList.add("hidden");
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

// Función para mostrar todos los cables relacionados con un dispositivo
export const showFibcabsForDevice = async (deviceSn) => {
  const popup = document.getElementById("fibcabPopup");
  const content = document.getElementById("fibcabContent");

  try {
    // Obtener datos de fibras relacionadas con el dispositivo
    const response = await fetch(
      `http://127.0.0.1:8000/fibcab/dev-info/?device_sn=${deviceSn}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching fibcabs for device: ${response.status}`);
    }
    const fibcabs = await response.json();

    // Construir el contenido del popup
    if (fibcabs.length === 0) {
      content.innerHTML = `<p>No fibcabs found for device SN: ${deviceSn}</p>`;
    } else {
      content.innerHTML = `
        <h4>Fibcabs for Device SN: ${deviceSn}</h4>
        <pre>${JSON.stringify(fibcabs, null, 2)}</pre>
      `;
    }
  } catch (error) {
    content.innerHTML = `<p>Error loading fibcab data: ${error.message}</p>`;
  }

  // Mostrar el popup
  popup.classList.remove("hidden");

  // Cerrar el popup al hacer clic en el botón "Close"
  document.getElementById("closeFibcabPopup").onclick = () => {
    popup.classList.add("hidden");
  };
};
