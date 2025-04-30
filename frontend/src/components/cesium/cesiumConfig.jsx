// Configuración de Tianditu
const token = "ac3385d7bfe8301140eb2c35b0e415ee";
const tdtUrl = "https://t{s}.tianditu.gov.cn/";
const subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"];

export const createImageryProvider = (layerType) => {
  return new Cesium.UrlTemplateImageryProvider({
    url: `${tdtUrl}DataServer?T=${layerType}&x={x}&y={y}&l={z}&tk=${token}`,
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 18,
  });
};

export const terrainProvider = new Cesium.EllipsoidTerrainProvider();

export const cesiumOptions = {
  terrainProvider: terrainProvider,
  infoBox: false,
  selectionIndicator: false,
  animation: false,
  timeline: false,
  geocoder: true,
  baseLayerPicker: false,
  creditContainer: document.createElement("div"),
};

// Función modificada para manejar las capas
export const addTiandituLayers = (
  viewer,
  baseLayerType = "img_w",
  roadNetworkEnabled = false
) => {
  if (!viewer || !viewer.imageryLayers) return;

  // Identificar y mantener la capa de red vial si existe
  let roadNetworkLayer = null;
  const layersToKeep = [];

  // Buscar la capa de red vial de manera segura
  for (let i = 0; i < viewer.imageryLayers.length; i++) {
    const layer = viewer.imageryLayers.get(i);
    try {
      const provider = layer.imageryProvider || layer._imageryProvider;
      if (provider && provider.url && provider.url.includes("cva_w")) {
        roadNetworkLayer = layer;
        layersToKeep.push(layer);
      }
    } catch (e) {
      console.warn("Error al inspeccionar capa:", e);
    }
  }

  // Eliminar todas las capas excepto las que queremos mantener
  for (let i = viewer.imageryLayers.length - 1; i >= 0; i--) {
    const layer = viewer.imageryLayers.get(i);
    if (!layersToKeep.includes(layer)) {
      viewer.imageryLayers.remove(layer, true);
    }
  }

  // Restaurar capas que queremos mantener
  layersToKeep.forEach((layer) => {
    viewer.imageryLayers.add(layer);
  });

  // Añadir nueva capa base
  const baseProvider = createImageryProvider(baseLayerType);
  viewer.imageryLayers.addImageryProvider(baseProvider, 0);

  // Añadir capa de red vial si está habilitada y no existe
  if (roadNetworkEnabled && !roadNetworkLayer) {
    const roadProvider = createImageryProvider("cva_w");
    const newRoadLayer = viewer.imageryLayers.addImageryProvider(roadProvider);
    newRoadLayer.alpha = 0.7;
  }

  // Configuración de la cámara
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 500;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 5000000;
};
export const flyToInitialPosition = (viewer) => {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(105.0, 35.0, 2000000),
    duration: 3,
  });
};
