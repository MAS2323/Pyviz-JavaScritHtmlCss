import React from "react";

const Footer = ({ cameraInfo }) => {
  if (!cameraInfo) return null; // No renderiza el Footer si no hay datos

  return (
    <footer className="cesium-footer">
      <div className="footer-left">
        <i className="fas fa-layer-group"></i> Layers
      </div>
      <div className="footer-center">
        <span>Google</span> 100% | <a href="#">Data attribution</a> | 1/1/2021
      </div>
      <div className="footer-right">
        <span>{cameraInfo.height}</span> | <span>{cameraInfo.coords}</span>
      </div>
    </footer>
  );
};

export default Footer;
