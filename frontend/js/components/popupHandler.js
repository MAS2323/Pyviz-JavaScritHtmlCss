export const showPopup = (device, clickPosition) => {
  const popup = document.getElementById("nodePopup");
  const nodeName = document.getElementById("nodeName");
  const nodeCity = document.getElementById("nodeCity");
  const nodeLocation = document.getElementById("nodeLocation");
  const nodeProducer = document.getElementById("nodeProducer");

  nodeName.textContent = device.name || "N/A";
  nodeCity.textContent = device.city || "N/A";
  nodeLocation.textContent = device.location || "N/A";
  nodeProducer.textContent = device.Producer || "N/A";

  // Position the popup near the click
  if (clickPosition) {
    popup.style.left = `${clickPosition.x + 10}px`;
    popup.style.top = `${clickPosition.y + 10}px`;
  }

  popup.classList.remove("hidden");

  document.getElementById("closePopup").onclick = () => {
    popup.classList.add("hidden");
  };
};

export const setupClickEvents = (viewer, devices) => {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

  handler.setInputAction((click) => {
    const pickedObject = viewer.scene.pick(click.position);

    if (
      Cesium.defined(pickedObject) &&
      pickedObject.id &&
      pickedObject.id.data
    ) {
      const device = pickedObject.id.data;
      const foundDevice = devices.find((d) => d.sn === device.sn);
      if (foundDevice) {
        showPopup(foundDevice, click.position); // Pass the click position
      }
    } else {
      const popup = document.getElementById("nodePopup");
      popup.classList.add("hidden");
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
