// components/baseLayerHandler.js

export function setupBaseLayerToggle(viewer) {
  const modeToggle = document.getElementById("modeToggle");
  if (!modeToggle) {
    console.error("El botón de cambio de modo no se encontró.");
    return;
  }

  // Crear el BaseLayerPicker si aún no existe
  let baseLayerPicker = document.getElementById("baseLayerContainer");
  if (!baseLayerPicker) {
    baseLayerPicker = document.createElement("div");
    baseLayerPicker.id = "baseLayerContainer";
    document.body.appendChild(baseLayerPicker);
  }

  // Obtener las capas base predeterminadas
  const imageryProviderViewModels =
    Cesium.createDefaultImageryProviderViewModels();

  const picker = new Cesium.BaseLayerPicker("baseLayerContainer", {
    globe: viewer.scene.globe,
    imageryProviderViewModels: imageryProviderViewModels,
    selectedImageryProviderViewModel: imageryProviderViewModels[0], // Seleccionar la primera capa por defecto
  });

  // Alternar visibilidad al hacer clic en el botón
  modeToggle.addEventListener("click", () => {
    baseLayerPicker.style.display =
      baseLayerPicker.style.display === "none" ? "block" : "none";
  });
}
