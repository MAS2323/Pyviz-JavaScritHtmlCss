import React, { useEffect, useState } from "react";
import { useCesium } from "../CesiumContext";
import {
  fetchAllDevices,
  fetchFibcabsForDevice,
  fetchFibcabStatus,
} from "../helpers/api";
import BottomRightPanel from "./node/RightPanel";
import LeftPanel from "./node/LeftPanel";
import FibcabLeftPanel from "./fibcab/FibcabLeftPanel";
import FibcabRightPanel from "./fibcab/FibcabRightPanel";

const FiberColors = {
  blue: Cesium.Color.BLUE.withAlpha(0.7),
  yellow: Cesium.Color.YELLOW.withAlpha(0.7),
  red: Cesium.Color.RED.withAlpha(0.7),
  green: Cesium.Color.LIME.withAlpha(0.7),
};

const DeviceLayer = () => {
  const { viewer } = useCesium();
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [fiberEntities, setFiberEntities] = useState({});

  useEffect(() => {
    if (!viewer) return;

    const loadDevicesAndFibers = async () => {
      try {
        const devices = await fetchAllDevices();
        const fiberEntitiesMap = {};

        for (const device of devices) {
          if (isValidCoordinate(device.longitude, device.lattitude)) {
            addDeviceEntity(viewer, device);
          }

          try {
            const fibcabs = await fetchFibcabsForDevice(device.sn);
            for (const fibcab of fibcabs) {
              const entity = await addFibcabEntity(viewer, fibcab);
              if (entity) {
                fiberEntitiesMap[fibcab.sn] = entity;
              }
            }
          } catch (error) {
            console.error(
              `Error loading fibcabs for device ${device.sn}:`,
              error
            );
          }
        }

        setFiberEntities(fiberEntitiesMap);
        startFiberStatusPolling(fiberEntitiesMap);
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

  const startFiberStatusPolling = (entitiesMap) => {
    const intervalId = setInterval(async () => {
      for (const [sn, entity] of Object.entries(entitiesMap)) {
        try {
          const status = await fetchFibcabStatus(sn);

          if (status?.fiber_color) {
            updateFiberColor(entity, status.fiber_color); // Actualiza el color

            if (selectedEntity?.data.sn === sn) {
              setSelectedEntity({
                ...selectedEntity,
                data: { ...selectedEntity.data, ...status },
              });
            }
          }
        } catch (error) {
          console.error(`Error actualizando estado de fibra ${sn}:`, error);
        }
      }
    }, 30000);

    return () => clearInterval(intervalId);
  };

  const updateFiberColor = (entity, color) => {
    if (!entity || !entity.polyline) return;

    // Forza la actualización del color
    entity.polyline.material = FiberColors[color] || FiberColors.green;

    // Actualiza el color de la flecha si existe
    if (entity.arrow) {
      entity.arrow.label.fillColor = FiberColors[color] || FiberColors.green;
    }

    // Opcional: muestra una notificación o log
    console.log(`Fibra ${entity.data.sn} actualizada a color: ${color}`);
  };

  const renderPopups = () => {
    if (!selectedEntity?.data) return null;

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
    } else if (
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
    data: { ...device, Type: "Device" },
  });
};

const addFibcabEntity = async (viewer, fibcab) => {
  if (
    !isValidCoordinate(fibcab.source_longitude, fibcab.source_latitude) ||
    !isValidCoordinate(fibcab.target_longitude, fibcab.target_latitude)
  ) {
    console.error(`Coordenadas inválidas para fibra ${fibcab.sn}`);
    return null;
  }

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

  let fiberColor = "green"; // Por defecto verde (no hay problemas)

  try {
    const status = await fetchFibcabStatus(fibcab.sn);

    if (status && status.fiber_color && FiberColors[status.fiber_color]) {
      fiberColor = status.fiber_color;
    } else {
      console.warn(`Usando color por defecto para ${fibcab.sn}`);
    }
  } catch (error) {
    console.error(`Error obteniendo estado para ${fibcab.sn}:`, error);
  }

  // Crear la polilínea para la fibra
  const polylineEntity = viewer.entities.add({
    polyline: {
      positions: [startPosition, endPosition],
      width: 5,
      material: FiberColors[fiberColor],
      clampToGround: true,
    },
    data: {
      ...fibcab,
      fiber_color: fiberColor,
    },
  });

  // Añadir flecha para indicar dirección
  const midPoint = Cesium.Cartesian3.midpoint(
    startPosition,
    endPosition,
    new Cesium.Cartesian3()
  );
  viewer.entities.add({
    position: midPoint,
    label: {
      text: "➔", // Símbolo de flecha para indicar dirección
      font: "20px sans-serif",
      fillColor: FiberColors[fiberColor],
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
    arrow: true, // Marcador para identificar la flecha
    parent: polylineEntity, // Vincular la flecha a la fibra
  });

  return polylineEntity;
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
