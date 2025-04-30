// Función para obtener información de sdh_dev_info
export const fetchSdhDevInfo = async (sn) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/sdh/dev-info/${sn}`);
    if (!response.ok) throw new Error("SDH Dev Info not found");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching SDH Dev Info for SN ${sn}:`, error);
    return null;
  }
};

// Función para obtener configuración de sdh_dev_config
export const fetchSdhDevConfig = async (sn) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/sdh/dev-config/${sn}`);
    if (!response.ok) throw new Error("SDH Dev Config not found");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching SDH Dev Config for SN ${sn}:`, error);
    return null;
  }
};

// Función para obtener estado de sdh_dev_state
export const fetchSdhDevState = async (sn) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/sdh/dev-state/${sn}`);
    if (!response.ok) throw new Error("SDH Dev State not found");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching SDH Dev State for SN ${sn}:`, error);
    return null;
  }
};

// Función para mostrar información de SDH en un popup
export const showSdhPopup = async (sn) => {
  const popup = document.getElementById("sdhPopup");
  const content = document.getElementById("sdhContent");

  try {
    // Obtener datos de sdh_dev_info
    const sdhInfo = await fetchSdhDevInfo(sn);
    if (!sdhInfo) throw new Error("SDH Dev Info not found");

    // Obtener datos de sdh_dev_config
    const sdhConfig = await fetchSdhDevConfig(sn);
    if (!sdhConfig) throw new Error("SDH Dev Config not found");

    // Obtener datos de sdh_dev_state
    const sdhState = await fetchSdhDevState(sn);
    if (!sdhState) throw new Error("SDH Dev State not found");

    // Construir el contenido del popup
    content.innerHTML = `
      <h4>SDH Dev Info</h4>
      <pre>${JSON.stringify(sdhInfo, null, 2)}</pre>
      <h4>SDH Dev Config</h4>
      <pre>${JSON.stringify(sdhConfig, null, 2)}</pre>
      <h4>SDH Dev State</h4>
      <pre>${JSON.stringify(sdhState, null, 2)}</pre>
    `;
  } catch (error) {
    content.innerHTML = `<p>Error loading SDH data: ${error.message}</p>`;
  }

  // Mostrar el popup
  popup.classList.remove("hidden");

  // Cerrar el popup al hacer clic en el botón "Close"
  document.getElementById("closeSdhPopup").onclick = () => {
    popup.classList.add("hidden");
  };
};
