// Función para mostrar el popup con la información del nodo
export const showPopup = (device) => {
  const popup = document.getElementById("nodePopup");
  const nodeName = document.getElementById("nodeName");
  const nodeCity = document.getElementById("nodeCity");
  const nodeLocation = document.getElementById("nodeLocation");
  const nodeProducer = document.getElementById("nodeProducer");

  // Llenar el contenido del popup
  nodeName.textContent = device.name;
  nodeCity.textContent = device.city;
  nodeLocation.textContent = device.location;
  nodeProducer.textContent = device.Producer;

  // Mostrar el popup
  popup.classList.remove("hidden");

  // Cerrar el popup al hacer clic en el botón "Close"
  document.getElementById("closePopup").onclick = () => {
    popup.classList.add("hidden");
  };
};

// Configurar eventos de clic en entidades
export const setupClickEvents = (viewer) => {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

  handler.setInputAction((click) => {
    const pickedObject = viewer.scene.pick(click.position);
    if (Cesium.defined(pickedObject) && pickedObject.id.onClick) {
      pickedObject.id.onClick();
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
