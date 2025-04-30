// js/components/dataProcessor.js

export function processDevices(devices) {
  return devices.map((device) => ({
    id: device.sn,
    name: device.name,
    city: device.city,
    location: device.location,
    longitude: device.longitude,
    latitude: device.lattitude,
    producer: device.Producer,
    position: Cesium.Cartesian3.fromDegrees(device.longitude, device.latitude),
  }));
}

export function processFibcabs(fibcabs, devices) {
  const deviceMap = new Map(devices.map((device) => [device.sn, device]));

  return fibcabs
    .map((fibcab) => {
      const sourceDevice = deviceMap.get(fibcab.source_sn);
      const targetDevice = deviceMap.get(fibcab.target_sn);

      if (!sourceDevice || !targetDevice) {
        console.warn(
          `Source or target device not found for fibcab: ${fibcab.id}`
        );
        return null;
      }

      return {
        id: fibcab.id,
        sourcePosition: Cesium.Cartesian3.fromDegrees(
          sourceDevice.longitude,
          sourceDevice.lattitude
        ),
        targetPosition: Cesium.Cartesian3.fromDegrees(
          targetDevice.longitude,
          targetDevice.lattitude
        ),
      };
    })
    .filter(Boolean); // Filtrar valores nulos
}
