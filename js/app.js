import { viewer } from "./cesiumSetup.js"; // Asegúrate de que el viewer esté disponible

// Agregar el geocoder a un contenedor personalizado
const geocoderContainer = document.getElementById("cesiumGeocoder");
const geocoder = new Cesium.Geocoder({
  container: geocoderContainer, // Usa el div personalizado
  scene: viewer.scene,
});

// Función para actualizar la información de la cámara en el footer
function updateCameraInfo() {
  const cameraHeightElement = document.getElementById("cameraHeight");
  const cameraCoordsElement = document.getElementById("cameraCoords");

  // Obtener la posición de la cámara en coordenadas geográficas
  const cameraPosition = viewer.camera.positionCartographic;
  const longitude = Cesium.Math.toDegrees(cameraPosition.longitude).toFixed(6);
  const latitude = Cesium.Math.toDegrees(cameraPosition.latitude).toFixed(6);
  const height = cameraPosition.height.toFixed(2);

  // Actualizar el texto en el footer
  cameraHeightElement.innerHTML = `Camera: ${height} km`;
  cameraCoordsElement.innerHTML = `${latitude}°N, ${longitude}°E`;
}

// Llamar a la función cuando la cámara se mueve
viewer.camera.moveEnd.addEventListener(updateCameraInfo);

// Actualizar la información al inicio
updateCameraInfo();

// Si deseas agregar el geocoder a la UI del viewer, puedes hacerlo así:
viewer.extend(Cesium.viewerCesiumNavigationMixin, {
  enableCompass: true,
  enableZoomControls: true,
  enableDistanceLegend: true,
  enableCompassOuterRing: true,
});

// Lógica para el botón modeToggle
const modeToggleButton = document.getElementById("modeToggle");
modeToggleButton.addEventListener("click", () => {
  viewer.baseLayerPicker.viewModel.dropDownVisible = true; // Mostrar el selector de capas base
});