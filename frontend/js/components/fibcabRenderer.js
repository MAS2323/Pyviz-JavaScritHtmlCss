export const renderFibcabs = (viewer, fibcabs, devices) => {
  const deviceMap = {};
  devices.forEach((device) => {
    deviceMap[device.sn] = device;
  });

  fibcabs.forEach((fibcab) => {
    const sourceDevice = deviceMap[fibcab.source_sn];
    const targetDevice = deviceMap[fibcab.target_sn];

    if (!sourceDevice || !targetDevice) {
      console.warn(`Missing device for fibcab ${fibcab.sn}`);
      return;
    }

    const sourcePosition = Cesium.Cartesian3.fromDegrees(
      parseFloat(sourceDevice.longitude),
      parseFloat(sourceDevice.lattitude),
      0 // Altura 0 para pegar al terreno
    );
    const targetPosition = Cesium.Cartesian3.fromDegrees(
      parseFloat(targetDevice.longitude),
      parseFloat(targetDevice.lattitude),
      0 // Altura 0 para pegar al terreno
    );

    viewer.entities.add({
      name: fibcab.tagId,
      polyline: {
        positions: [sourcePosition, targetPosition],
        width: 5, // Aumenta el ancho de la línea
        clampToGround: true, // Pegar la línea al terreno
        material: Cesium.Color.BLUE, // Cambia el color para depuración
        disableDepthTestDistance: Number.POSITIVE_INFINITY, // Hacer que siempre sea visible
      },
    });
  });
};
