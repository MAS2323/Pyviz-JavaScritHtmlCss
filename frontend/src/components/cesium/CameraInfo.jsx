import React, { useEffect, useState } from "react";
import { useCesium } from "../../CesiumContext";

const CameraInfo = () => {
  const { viewer } = useCesium();
  const [cameraInfo, setCameraInfo] = useState({
    height: "Loading...",
    coords: "Loading...",
  });

  useEffect(() => {
    if (!viewer || !viewer.scene) return;

    const updateCameraData = () => {
      try {
        const cameraPosition = viewer.camera.positionCartographic;
        if (!cameraPosition) return;

        const longitude = Cesium.Math.toDegrees(
          cameraPosition.longitude
        ).toFixed(6);
        const latitude = Cesium.Math.toDegrees(cameraPosition.latitude).toFixed(
          6
        );
        const height = (cameraPosition.height / 1000).toFixed(2);

        setCameraInfo({
          height: `高度: ${height} km`,
          coords: `纬度: ${latitude}°N, 长度: ${longitude}°E`,
        });
      } catch (error) {
        console.error("Error updating camera info:", error);
      }
    };

    viewer.camera.moveEnd.addEventListener(updateCameraData);
    updateCameraData();

    return () => {
      if (viewer.camera.moveEnd) {
        viewer.camera.moveEnd.removeEventListener(updateCameraData);
      }
    };
  }, [viewer]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 50,
        left: 20,
        background: "#1a1a1a",
        color: "#fff",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      <p>{cameraInfo.height}</p>
      <p>{cameraInfo.coords}</p>
    </div>
  );
};

export default CameraInfo;
