export const fetchDevice = async (sn) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/device-info/${sn}`);
    if (!response.ok) throw new Error("Error fetching device");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching device with SN ${sn}:`, error);
    return null;
  }
};

export const fetchAllDevices = async () => {
  try {
    // Aquí asumimos que hay una ruta para obtener todos los dispositivos.
    const response = await fetch("http://127.0.0.1:8000/device-info/");
    if (!response.ok) throw new Error("Error fetching devices");
    return await response.json();
  } catch (error) {
    console.error("Error fetching all devices:", error);
    return [];
  }
};

export const fetchFibcab = async (sn) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/fibcab/dev-info/${sn}`);
    if (!response.ok) throw new Error("Error fetching fibcab");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching fibcab with SN ${sn}:`, error);
    return null;
  }
};
