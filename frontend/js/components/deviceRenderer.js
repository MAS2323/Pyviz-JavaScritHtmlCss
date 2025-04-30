import { showPopup } from "./popupHandler.js";

// Renderizar dispositivos como puntos en el mapa
export const renderDevices = (viewer, devices) => {
  devices.forEach((device) => {
    const position = Cesium.Cartesian3.fromDegrees(
      parseFloat(device.longitude),
      parseFloat(device.lattitude),
      1000 // Altura en metros
    );

    const entity = viewer.entities.add({
      name: device.name,
      position: position,
      point: {
        pixelSize: 10,
        color: Cesium.Color.RED,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
      label: {
        text: device.name,
        font: "14px sans-serif",
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -20),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
      data: device, // Almacenar los datos del dispositivo para el popup
    });

    // Agregar evento onClick para mostrar el popup
    entity.addProperty("onClick", () => {
      showPopup(device);
    });
  });
};
