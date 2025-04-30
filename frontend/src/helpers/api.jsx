const API_BASE_URL = "http://127.0.0.1:8000";
import axios from "axios";
// ==================== FUNCIONES DE FETCH ====================
// Función auxiliar para extraer el SN de un objeto si es necesario
const getSerialNumber = (sn) => {
  if (typeof sn === "object" && sn !== null) {
    return sn.sn || sn.id || null;
  }
  return sn;
};

export const fetchDevice = async (sn) => {
  const serialNumber = getSerialNumber(sn);
  if (!serialNumber) {
    console.error("SN inválido o no proporcionado.");
    return null;
  }

  try {
    console.log(`Buscando dispositivo con SN: ${serialNumber}`);
    const response = await fetch(
      `${API_BASE_URL}/device-info/${encodeURIComponent(serialNumber)}`
    );

    console.log(`Respuesta del servidor para SN ${serialNumber}:`, response);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Dispositivo con SN ${serialNumber} no encontrado.`);
        return null;
      }
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Datos recibidos para SN ${serialNumber}:`, data);
    return data;
  } catch (error) {
    console.error(
      `Error al obtener el dispositivo con SN ${serialNumber}:`,
      error
    );
    return null;
  }
};

export const fetchFibcab = async (sn) => {
  const serialNumber = getSerialNumber(sn);
  if (!serialNumber) {
    console.error("SN inválido o no proporcionado.");
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/fibcab/dev-info/${encodeURIComponent(serialNumber)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Fibra con SN ${serialNumber} no encontrada.`);
        return null;
      }
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Datos de la fibra (${serialNumber}):`, data);
    return data;
  } catch (error) {
    console.error(`Error al obtener la fibra con SN ${serialNumber}:`, error);
    return null;
  }
};

// Función auxiliar para manejar errores de fetch
const handleFetchError = (error, context = "") => {
  console.error(`Error ${context}:`, error);
  throw error; // Puedes modificar esto para devolver null o un objeto de error según tu necesidad
};

// Función auxiliar para extraer el SN de un objeto si es necesario
// const getSerialNumber = (sn) => {
//   if (typeof sn === "object" && sn !== null) {
//     return sn.sn || sn.id || null;
//   }
//   return sn;
// };

// ==================== FIBCAB Dev Info ====================
export const createFibcabInfo = async (fibcabInfoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fibcab/dev-info/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fibcabInfoData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleFetchError(error, "creando información de FIBCAB");
  }
};

export const fetchFibcabInfo = async (sn) => {
  const serialNumber = getSerialNumber(sn);
  if (!serialNumber) return null;

  try {
    const response = await fetch(
      `${API_BASE_URL}/fibcab/dev-info/${encodeURIComponent(serialNumber)}`
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleFetchError(
      error,
      `obteniendo información de FIBCAB con SN ${serialNumber}`
    );
  }
};

export const fetchFibcabsForDevice = async (deviceSn) => {
  const serialNumber = getSerialNumber(deviceSn);
  if (!serialNumber) return [];

  try {
    const response = await fetch(
      `${API_BASE_URL}/fibcab/dev-info/?device_sn=${encodeURIComponent(
        serialNumber
      )}`
    );

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleFetchError(
      error,
      `obteniendo FIBCABs para dispositivo ${serialNumber}`
    );
  }
};

export const fetchAllFibcabs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/fibcab/dev-info-all/`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleFetchError(error, "obteniendo todas las FIBCABs");
  }
};

// export const fetchAllFibcabInfo = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/fibcab/dev-info/`);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     return handleFetchError(error, "obteniendo toda la información de FIBCABs");
//   }
// };
// ==================== FIBCAB Dev Config ====================
export const createFibcabConfig = async (fibcabConfigData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fibcab/dev-config/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fibcabConfigData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleFetchError(error, "creando configuración de FIBCAB");
  }
};

export const fetchFibcabConfig = async (sn) => {
  const serialNumber = getSerialNumber(sn);
  if (!serialNumber) return null;

  try {
    const response = await fetch(
      `${API_BASE_URL}/fibcab/dev-config/${encodeURIComponent(serialNumber)}`
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleFetchError(
      error,
      `obteniendo configuración de FIBCAB con SN ${serialNumber}`
    );
  }
};

// ==================== FIBCAB Dev State ====================
export const createFibcabState = async (fibcabStateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fibcab/dev-state/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fibcabStateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleFetchError(error, "creando estado de FIBCAB");
  }
};

export const fetchFibcabState = async (sn) => {
  const serialNumber = getSerialNumber(sn);
  if (!serialNumber) return null;

  try {
    const response = await fetch(
      `${API_BASE_URL}/fibcab/dev-state/${encodeURIComponent(serialNumber)}`
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleFetchError(
      error,
      `obteniendo estado de FIBCAB con SN ${serialNumber}`
    );
  }
};

// ==================== FIBCAB Cálculos y Análisis ====================
export const calculateFibcabParameters = async (fibcabSn) => {
  const serialNumber = getSerialNumber(fibcabSn);
  if (!serialNumber) return null;

  try {
    const response = await fetch(
      `${API_BASE_URL}/fibcab/calculate/${encodeURIComponent(serialNumber)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleFetchError(
      error,
      `calculando parámetros para FIBCAB ${serialNumber}`
    );
  }
};

export const fetchBottlenecks = async (deviceSn = null) => {
  try {
    let url = `${API_BASE_URL}/fibcab/bottlenecks`;
    if (deviceSn) {
      const serialNumber = getSerialNumber(deviceSn);
      if (!serialNumber) return null;
      url = `${API_BASE_URL}/fibcab/bottlenecks/${encodeURIComponent(
        serialNumber
      )}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleFetchError(error, "obteniendo cuellos de botella");
  }
};

export const calculateHealthScore = async (warnings = 0, crises = 0) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/fibcab/health-score/?warnings=${warnings}&crises=${crises}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleFetchError(error, "calculando puntaje de salud");
  }
};

// ==================== Función combinada para obtener todos los datos de una FIBCAB ====================
export const fetchCompleteFibcabData = async (sn) => {
  const serialNumber = getSerialNumber(sn);
  if (!serialNumber) return null;

  try {
    const [info, config, state] = await Promise.all([
      fetchFibcabInfo(serialNumber),
      fetchFibcabConfig(serialNumber),
      fetchFibcabState(serialNumber),
    ]);

    return {
      info,
      config,
      state,
    };
  } catch (error) {
    return handleFetchError(
      error,
      `obteniendo datos completos de FIBCAB ${serialNumber}`
    );
  }
};

/**
 * Obtiene un dispositivo por su número de serie
 * @param {string|Object} sn - Número de serie o objeto que contiene el SN
 * @returns {Promise<Object|null>} - Dispositivo encontrado o null si no existe
 */
export const fetchDeviceInfo = async (sn) => {
  const serialNumber = getSerialNumber(sn);
  if (!serialNumber) return null;

  try {
    const response = await fetch(
      `${API_BASE_URL}/device-info/${encodeURIComponent(serialNumber)}`
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleFetchError(
      error,
      `obteniendo información de dispositivo con SN ${serialNumber}`
    );
  }
};

/**
 * Obtiene todos los dispositivos
 * @returns {Promise<Array>} - Lista de todos los dispositivos
 */
export const fetchAllDevices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/device-info/`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleFetchError(error, "obteniendo todos los dispositivos");
  }
};

/**
 * Actualiza un dispositivo existente
 * @param {string|Object} sn - Número de serie o objeto que contiene el SN
 * @param {Object} updateData - Datos a actualizar
 * @returns {Promise<Object>} - Dispositivo actualizado
 */
export const updateDeviceInfo = async (sn, updateData) => {
  const serialNumber = getSerialNumber(sn);
  if (!serialNumber) return null;

  try {
    const response = await fetch(
      `${API_BASE_URL}/device-info/${encodeURIComponent(serialNumber)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleFetchError(
      error,
      `actualizando dispositivo con SN ${serialNumber}`
    );
  }
};

/**
 * Elimina un dispositivo
 * @param {string|Object} sn - Número de serie o objeto que contiene el SN
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const deleteDeviceInfo = async (sn) => {
  const serialNumber = getSerialNumber(sn);
  if (!serialNumber) return null;

  try {
    const response = await fetch(
      `${API_BASE_URL}/device-info/${encodeURIComponent(serialNumber)}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleFetchError(
      error,
      `eliminando dispositivo con SN ${serialNumber}`
    );
  }
};

// ==================== Funciones Relacionadas con FIBCAB ====================

/**
 * Obtiene las FIBCABs asociadas a un dispositivo como fuente
 * @param {string|Object} sn - Número de serie del dispositivo
 * @returns {Promise<Array>} - Lista de FIBCABs donde el dispositivo es fuente
 */
export const fetchFibcabsAsSource = async (sn) => {
  const serialNumber = getSerialNumber(sn);
  if (!serialNumber) return [];

  try {
    const allFibcabs = await fetchAllDevices(); // Asumiendo que tienes esta función
    return allFibcabs.filter((fibcab) => fibcab.fibcab_source === serialNumber);
  } catch (error) {
    return handleFetchError(
      error,
      `buscando FIBCABs como fuente para dispositivo ${serialNumber}`
    );
  }
};

/**
 * Obtiene las FIBCABs asociadas a un dispositivo como destino
 * @param {string|Object} sn - Número de serie del dispositivo
 * @returns {Promise<Array>} - Lista de FIBCABs donde el dispositivo es destino
 */
export const fetchFibcabsAsTarget = async (sn) => {
  const serialNumber = getSerialNumber(sn);
  if (!serialNumber) return [];

  try {
    const allFibcabs = await fetchAllDevices(); // Asumiendo que tienes esta función
    return allFibcabs.filter((fibcab) => fibcab.fibcab_target === serialNumber);
  } catch (error) {
    return handleFetchError(
      error,
      `buscando FIBCABs como destino para dispositivo ${serialNumber}`
    );
  }
};

/**
 * Obtiene todas las FIBCABs relacionadas con un dispositivo (como fuente o destino)
 * @param {string|Object} sn - Número de serie del dispositivo
 * @returns {Promise<Array>} - Lista de todas las FIBCABs relacionadas
 */
export const fetchAllRelatedFibcabs = async (sn) => {
  const serialNumber = getSerialNumber(sn);
  if (!serialNumber) return [];

  try {
    const [asSource, asTarget] = await Promise.all([
      fetchFibcabsAsSource(serialNumber),
      fetchFibcabsAsTarget(serialNumber),
    ]);

    return [...asSource, ...asTarget];
  } catch (error) {
    return handleFetchError(
      error,
      `buscando todas las FIBCABs relacionadas con dispositivo ${serialNumber}`
    );
  }
};

// Añadir estas funciones a tus helpers/api.js
export const fetchIolpInfo = async (sn) => {
  try {
    const response = await fetch(`${API_BASE_URL}/iolp/dev-info`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching IOLP info for SN ${sn}:`, error);
    return null;
  }
};

export const fetchIolpConfig = async (sn) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/iolp/dev-config/${encodeURIComponent(sn)}`
    );
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching IOLP config for SN ${sn}:`, error);
    return null;
  }
};

export const fetchIolpState = async (sn) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/iolp/dev-state/${encodeURIComponent(sn)}`
    );
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching IOLP state for SN ${sn}:`, error);
    return null;
  }
};

// JMPMAT
export const fetchJmpmat = async (gId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/jmpmat/${encodeURIComponent(gId)}`
    );
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw new Error(`Error fetching JMPMAT ${gId}: ${err.message}`);
  }
};

export const fetchAllJmpmats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/jmpmat/`);
    return response.data;
  } catch (err) {
    throw new Error(`Error fetching all JMPMATs: ${err.message}`);
  }
};

// SDH
export const fetchSdhInfo = async (sn) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sdh/dev-info`);
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw new Error(`Error fetching SDH info ${sn}: ${err.message}`);
  }
};

export const fetchSdhConfig = async (sn) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/sdh/dev-config/${encodeURIComponent(sn)}`
    );
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw new Error(`Error fetching SDH config ${sn}: ${err.message}`);
  }
};

export const fetchSdhState = async (sn) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/sdh/dev-state/${encodeURIComponent(sn)}`
    );
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw new Error(`Error fetching SDH state ${sn}: ${err.message}`);
  }
};

// TRAFFSTUB
export const fetchTraffstubInfo = async (sn) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/traffstub/dev-info`);
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw new Error(`Error fetching TRAFFSTUB info ${sn}: ${err.message}`);
  }
};

export const fetchTraffstubConfig = async (sn) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/traffstub/dev-config/${encodeURIComponent(sn)}`
    );
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw new Error(`Error fetching TRAFFSTUB config ${sn}: ${err.message}`);
  }
};

export const fetchTraffstubState = async (sn) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/traffstub/dev-state/${encodeURIComponent(sn)}`
    );
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw new Error(`Error fetching TRAFFSTUB state ${sn}: ${err.message}`);
  }
};

// ==================== FUNCIONES PARA VISUALIZACIÓN ====================
export const fetchProcessedData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pyviz/processed-data`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos procesados:", error);
    throw error;
  }
};

export const fetchDevicesGeoJSON = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pyviz/devices`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener dispositivos GeoJSON:", error);
    throw error;
  }
};

export const fetchNetworkGeoJSON = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pyviz/network`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener red GeoJSON:", error);
    throw error;
  }
};

export const fetchCesiumConfig = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pyviz/cesium-config`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener configuración de Cesium:", error);
    throw error;
  }
};
