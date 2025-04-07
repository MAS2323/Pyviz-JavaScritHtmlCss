const MODEL_PATHS = {
  optical_transmitter: "./frontend/js/model3d/optical_transmitter.glb",
  network_switch: "./frontend/js/model3d/network_switch.glb",
  fiber_cabinet: "./frontend/js/model3d/fiber_cabinet.glb",
  patch_panel: "./frontend/js/model3d/patch_panel.glb",
  default: "./frontend/js/model3d/default_model.glb", // Modelo predeterminado
};

// Precarga los modelos para mejor performance
export const preloadModels = async (viewer) => {
  const models = {};

  for (const [key, path] of Object.entries(MODEL_PATHS)) {
    try {
      // Crear una entidad con el modelo
      const entity = viewer.entities.add({
        position: Cesium.Cartesian3.ZERO, // Posición temporal
        model: {
          uri: path,
          show: false, // Ocultar hasta que se necesite
        },
      });

      models[key] = entity;
    } catch (error) {
      console.error(`Error loading model ${key}:`, error);
    }
  }

  return models;
};

// Configuración por tipo de dispositivo
export const getModelConfig = (deviceType) => {
  const configs = {
    optical_transmitter: {
      scale: 2.5,
      minimumPixelSize: 32,
      maximumScale: 20000,
    },
    network_switch: {
      scale: 1.8,
      minimumPixelSize: 28,
    },
    default: {
      scale: 1.0,
      minimumPixelSize: 64,
    },
  };

  return configs[deviceType] || configs.default;
};
