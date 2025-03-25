// Configuración de Tianditu
const token = "ac3385d7bfe8301140eb2c35b0e415ee"; // Token de Tianditu
const tdtUrl = "https://t{s}.tianditu.gov.cn/";
const subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"];

// Crear proveedores de imágenes para Tianditu
export function createImageryProvider(layerType) {
  return new Cesium.UrlTemplateImageryProvider({
    url: `${tdtUrl}DataServer?T=${layerType}&x={x}&y={y}&l={z}&tk=${token}`,
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 18,
  });
}

// Función para inicializar el viewer de Cesium
export function initializeViewer() {
  const cesiumContainer = document.getElementById("cesiumContainer");
  if (!cesiumContainer) {
    console.error("No se encontró el contenedor #cesiumContainer");
    return null;
  }

  // Inicializar Cesium Viewer sin el token de Cesium Ion
  const viewer = new Cesium.Viewer("cesiumContainer", {
    animation: false,
    timeline: false,
    geocoder: false,
    scene3DOnly: true,
    baseLayerPicker: false, 
    terrainExaggeration: 1.0,
    creditContainer: document.createElement("div"), 
  });

  // Agregar capas de Tianditu
  const imageProviderUno = createImageryProvider("img_w"); // Capa de imágenes
  const imageProviderDos = createImageryProvider("cia_w"); // Capa de anotaciones en chino
  const imageProviderTres = createImageryProvider("ibo_w"); // Capa de anotaciones en inglés

  viewer.imageryLayers.addImageryProvider(imageProviderUno);
  viewer.imageryLayers.addImageryProvider(imageProviderDos);
  viewer.imageryLayers.addImageryProvider(imageProviderTres);

  // Configuración de la cámara
  viewer.scene.screenSpaceCameraController.zoomFactor = 1.1; // Controla la velocidad del zoom
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50000; // Mínimo zoom (en metros)
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 5000000; // Máximo zoom (en metros)

  // Configurar el geocoder en el contenedor personalizado
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
    const latitude = Cesium.Math.toDegrees(cameraPosition.latitude).toFixed(6);
    const height = cameraPosition.height.toFixed(2);

    cameraHeightElement.innerHTML = `Camera: ${height} km`;
    cameraCoordsElement.innerHTML = `${latitude}°N, ${longitude}°E`;
  }

  viewer.camera.moveEnd.addEventListener(updateCameraInfo);
  updateCameraInfo();

  // Vuelo inicial de la cámara
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(105.0, 35.0, 2000000), // Coordenadas iniciales
    duration: 3, // Tiempo en segundos
  });

  console.log("Cesium con Tianditu cargado correctamente.");

  return viewer; 
}
