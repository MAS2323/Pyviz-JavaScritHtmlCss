import React from "react";
import CesiumViewer from "./CesiumViewer";

const CesiumViewerWrapper = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CesiumViewer />
    </div>
  );
};

export default CesiumViewerWrapper;
