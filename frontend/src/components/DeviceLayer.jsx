import React, { useEffect, useState } from "react";
import { useCesium } from "../CesiumContext";
import { fetchAllDevices, fetchFibcabsForDevice } from "../helpers/api";
import BottomRightPanel from "./node/RightPanel";
import LeftPanel from "./node/LeftPanel";
import FibcabLeftPanel from "./fibcab/FibcabLeftPanel"; // Nuevo componente
import FibcabRightPanel from "./fibcab/FibcabRightPanel"; // Nuevo componente

const DeviceLayer = () => {
  const { viewer } = useCesium();
  const [selectedEntity, setSelectedEntity] = useState(null);

  useEffect(() => {
    if (!viewer) return;

    const loadDevicesAndFibers = async () => {
      try {
        const devices = await fetchAllDevices();

        for (const device of devices) {
          if (isValidCoordinate(device.longitude, device.lattitude)) {
            const deviceWithType = {
              ...device,
              Type: "Device",
            };
            addDeviceEntity(viewer, deviceWithType);
          }

          try {
            const fibcabs = await fetchFibcabsForDevice(device.sn);
            addFibcabEntities(viewer, fibcabs);
          } catch (error) {
            console.error(
              `Error loading fibcabs for device ${device.sn}:`,
              error
            );
          }
        }
      } catch (error) {
        console.error("Error loading devices:", error);
      }
    };

    loadDevicesAndFibers();

    const handleSelection = (selected) => {
      if (selected && selected.data) {
        setSelectedEntity(selected);
      } else {
        setSelectedEntity(null);
      }
    };

    viewer.selectedEntityChanged.addEventListener(handleSelection);

    return () => {
      viewer.selectedEntityChanged.removeEventListener(handleSelection);
    };
  }, [viewer]);

  const renderPopups = () => {
    if (!selectedEntity?.data) return null;

    // Dispositivo (tiene campo Type)
    if (selectedEntity.data.Type) {
      return (
        <>
          <LeftPanel
            data={selectedEntity.data}
            onClose={() => setSelectedEntity(null)}
          />
          <BottomRightPanel data={selectedEntity.data} />
        </>
      );
    }
    // Fibra (tiene source_longitude y target_longitude)
    else if (
      selectedEntity.data.source_longitude &&
      selectedEntity.data.target_longitude
    ) {
      return (
        <>
          <FibcabLeftPanel
            data={selectedEntity.data}
            onClose={() => setSelectedEntity(null)}
          />
          <FibcabRightPanel data={selectedEntity.data} />
        </>
      );
    }

    return null;
  };

  return renderPopups();
};

// Helper functions (se mantienen igual)
const addDeviceEntity = (viewer, device) => {
  const devicePosition = Cesium.Cartesian3.fromDegrees(
    parseFloat(device.longitude),
    parseFloat(device.lattitude),
    0
  );

  return viewer.entities.add({
    position: devicePosition,
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
    data: device,
  });
};

const addFibcabEntities = (viewer, fibcabs) => {
  fibcabs.forEach((fibcab) => {
    if (
      isValidCoordinate(fibcab.source_longitude, fibcab.source_latitude) &&
      isValidCoordinate(fibcab.target_longitude, fibcab.target_latitude)
    ) {
      const startPosition = Cesium.Cartesian3.fromDegrees(
        parseFloat(fibcab.source_longitude),
        parseFloat(fibcab.source_latitude),
        0
      );

      const endPosition = Cesium.Cartesian3.fromDegrees(
        parseFloat(fibcab.target_longitude),
        parseFloat(fibcab.target_latitude),
        0
      );

      viewer.entities.add({
        polyline: {
          positions: [startPosition, endPosition],
          width: 5,
          material: Cesium.Color.BLUE,
          clampToGround: true,
        },
        data: fibcab,
      });
    } else {
      console.error(`Coordenadas inválidas para fibra ${fibcab.sn}`);
    }
  });
};

const isValidCoordinate = (longitude, latitude) => {
  return (
    longitude !== null &&
    latitude !== null &&
    !isNaN(parseFloat(longitude)) &&
    !isNaN(parseFloat(latitude)) &&
    parseFloat(longitude) >= -180 &&
    parseFloat(longitude) <= 180 &&
    parseFloat(latitude) >= -90 &&
    parseFloat(latitude) <= 90
  );
};

export default DeviceLayer;
