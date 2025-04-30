import React, { useEffect, useRef, useState } from "react";
import { useCesium } from "../../CesiumContext";
import {
  cesiumOptions,
  addTiandituLayers,
  flyToInitialPosition,
} from "../cesium/cesiumConfig";
import Toolbar from "../viewer/Toolbar";
import Footer from "../viewer/Footer";
import CameraInfo from "./CameraInfo";
import ErrorBoundary from "./ErrorBoundary";
import DeviceLayer from "../DeviceLayer";
import FloatingButtons from "../viewer/FloatingButtons";
import "./CesiumViewer.css"; // Import the CSS file

const CesiumViewer = ({ onLogout }) => {
  const cesiumContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const { viewer, setViewer } = useCesium();
  const [roadNetworkEnabled, setRoadNetworkEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
          <CameraInfo />
        </ErrorBoundary>
      )}
      {viewer && (
        <FloatingButtons
          onLayerChange={handleLayerChange}
          onToggleRoadNetwork={handleToggleRoadNetwork}
          roadNetworkEnabled={roadNetworkEnabled}
          isMobile={isMobile}
        />
      )}
      {viewer && (
        <Toolbar
          viewer={viewer}
          isMobile={isMobile}
          onLogout={onLogout} // Pass onLogout to Toolbar
        />
      )}
      {viewer && <Footer isMobile={isMobile} />}
    </div>
  );
};

export default CesiumViewer;
