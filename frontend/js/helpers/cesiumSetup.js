// cesiumSetup.js

// Configuración de Tianditu y otros parámetros
const token = "ac3385d7bfe8301140eb2c35b0e415ee";
const tdtUrl = "https://t{s}.tianditu.gov.cn/";
const subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"];
const createImageryProvider = (layerType) => {
  return new Cesium.UrlTemplateImageryProvider({
    url: `${tdtUrl}DataServer?T=${layerType}&x={x}&y={y}&l={z}&tk=${token}`,
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 18,
  });
};

// Inicialización del viewer de Cesium
export const initializeViewer = () => {
  const cesiumContainer = document.getElementById("cesiumContainer");

  if (!cesiumContainer) {
    console.error(
      "No se encontró el elemento #cesiumContainer. Asegúrate de que 'main.html' se haya cargado antes."
    );
    return;
  }

  // Configurar el token de Cesium Ion
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxOTYyMTc5ZC00Y2IyLTRlMWEtOGM4OS00Njg5OGVhNzdhZGMiLCJpZCI6MjcxNTA3LCJpYXQiOjE3Mzc4Nzg1MTN9.xL6gLe2zsw-YBfc-9O4BviD4AEXJLQ-jby9AOtxdlbQ";

  // Crear proveedores de imágenes de Tianditu
  const imageProviderUno = createImageryProvider("img_w");
  const imageProviderDos = createImageryProvider("cia_w");
  const imageProviderTres = createImageryProvider("ibo_w");

  try {
    const viewer = new Cesium.Viewer("cesiumContainer", {
      terrainProvider: Cesium.createWorldTerrain(),
      animation: false,
      timeline: false,
      geocoder: false,
      scene3DOnly: true,
      baseLayerPicker: true,
      terrainExageration: 1.0,
      creditContainer: document.createElement("div"),
    });
    viewer.imageryLayers.addImageryProvider(imageProviderUno);
    viewer.imageryLayers.addImageryProvider(imageProviderDos);
    viewer.imageryLayers.addImageryProvider(imageProviderTres);
    viewer.scene.screenSpaceCameraController.zoomFactor = 1.1; // Controla la velocidad del zoom
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50000; // Establece el mínimo zoom (en metros)
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 5000000; // Establece el máximo zoom (en metros)

    console.log("Cesium Viewer cargado correctamente");

    // Agregar el geocoder a un contenedor personalizado
    const geocoderContainer = document.getElementById("cesiumGeocoder");
    if (geocoderContainer) {
      new Cesium.Geocoder({
        container: geocoderContainer,
        scene: viewer.scene,
      });
    }

    // Función para actualizar la información de la cámara
    function updateCameraInfo() {
      const cameraHeightElement = document.getElementById("cameraHeight");
      const cameraCoordsElement = document.getElementById("cameraCoords");

      if (!cameraHeightElement || !cameraCoordsElement) return;

      const cameraPosition = viewer.camera.positionCartographic;
      const longitude = Cesium.Math.toDegrees(cameraPosition.longitude).toFixed(
        6
      );
      const latitude = Cesium.Math.toDegrees(cameraPosition.latitude).toFixed(
        6
      );
      const height = cameraPosition.height.toFixed(2);

      cameraHeightElement.innerHTML = `Camera: ${height} km`;
      cameraCoordsElement.innerHTML = `${latitude}°N, ${longitude}°E`;
    }

    viewer.camera.moveEnd.addEventListener(updateCameraInfo);
    updateCameraInfo();
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(105.0, 35.0, 2000000),
      duration: 3, // tiempo en segundos para el movimiento
    });

    return viewer;
  } catch (error) {
    console.error("Error al inicializar Cesium:", error);
  }
};
