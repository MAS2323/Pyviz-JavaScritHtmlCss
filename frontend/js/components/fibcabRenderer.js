// Renderizar fibras como líneas entre los nodos
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
      1000
    );
    const targetPosition = Cesium.Cartesian3.fromDegrees(
      parseFloat(targetDevice.longitude),
      parseFloat(targetDevice.lattitude),
      1000
    );

    viewer.entities.add({
      name: fibcab.tagId,
      polyline: {
        positions: [sourcePosition, targetPosition],
        width: 2,
        material: Cesium.Color.BLUE,
      },
    });
  });
};
