import React, { useEffect, useRef, useState } from "react";
import { useCesium } from "../../CesiumContext";
import {
  cesiumOptions,
  addTiandituLayers,
  flyToInitialPosition,
} from "../cesium/cesiumConfig";
import Toolbar from "../viewer/Toolbar";
import CameraInfo from "./CameraInfo";
import ErrorBoundary from "./ErrorBoundary";
import DeviceLayer from "../DeviceLayer";
import FloatingButtons from "../viewer/FloatingButtons";
import "./CesiumViewer.css";
import BottleneckPopup from "../viewer/BottleneckPopup";
import BottleneckIndicator from "../viewer/BottleneckIndicator";

const CesiumViewer = ({ onLogout }) => {
  const cesiumContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const { viewer, setViewer } = useCesium();
  const [roadNetworkEnabled, setRoadNetworkEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showBottleneck, setShowBottleneck] = useState(false);
  const [bottleneckData, setBottleneckData] = useState(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (viewerRef.current) {
        viewerRef.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize Cesium viewer
  useEffect(() => {
    if (!cesiumContainerRef.current) return;

    const viewerInstance = new Cesium.Viewer(
      cesiumContainerRef.current,
      cesiumOptions
    );

    viewerRef.current = viewerInstance;
    addTiandituLayers(viewerInstance, "img_w", roadNetworkEnabled);
    flyToInitialPosition(viewerInstance);
    setViewer(viewerInstance);

    // Adjust camera controls for mobile
    if (isMobile) {
      viewerInstance.scene.screenSpaceCameraController.minimumZoomDistance = 100;
      viewerInstance.scene.screenSpaceCameraController.zoomFactor = 2.0;
    }

    return () => {
      if (viewerInstance && !viewerInstance.isDestroyed()) {
        viewerInstance.destroy();
      }
    };
  }, [isMobile]);

  // Update bottleneck data when a new entity is selected
  useEffect(() => {
    if (viewer && viewer.selectedEntity) {
      const entityData = viewer.selectedEntity.data;
      if (entityData && entityData.fiber_color) {
        setBottleneckData({
          capacity: entityData.capacity || 100,
          health: entityData.health || 95,
          usage_percentage: entityData.usage_percentage || 70,
          fiber_status: entityData.fiber_color,
        });
        setShowBottleneck(true);
      } else {
        setShowBottleneck(false);
      }
    }
  }, [viewer?.selectedEntity]);

  const handleLayerChange = (layerType) => {
    if (viewerRef.current) {
      addTiandituLayers(viewerRef.current, layerType, roadNetworkEnabled);
    }
  };

  const handleToggleRoadNetwork = (enabled) => {
    setRoadNetworkEnabled(enabled);
    if (viewerRef.current) {
      addTiandituLayers(viewerRef.current, undefined, enabled);
    }
  };

  return (
    <div className="cesium-viewer-container">
      <div ref={cesiumContainerRef} className="cesium-container" />
      {viewer && <DeviceLayer />}
      {viewer && (
        <ErrorBoundary>
          <div style={{ zIndex: 100 }}>
            <CameraInfo />
          </div>
        </ErrorBoundary>
      )}
      {viewer && (
        <div style={{ zIndex: 100 }}>
          <FloatingButtons
            onLayerChange={handleLayerChange}
            onToggleRoadNetwork={handleToggleRoadNetwork}
            roadNetworkEnabled={roadNetworkEnabled}
            isMobile={isMobile}
          />
        </div>
      )}
      {viewer && (
        <Toolbar viewer={viewer} isMobile={isMobile} onLogout={onLogout} />
      )}
      {viewer && (
        <div
          style={{
            position: "absolute",
            bottom: "0px", // Position at the very bottom to occupy the footer area
            left: 0,
            right: 0,
            width: "100%",
            zIndex: 10, // Lower zIndex to appear below CameraInfo and FloatingButtons
          }}
        >
          <BottleneckPopup />
        </div>
      )}
    </div>
  );
};

export default CesiumViewer;
