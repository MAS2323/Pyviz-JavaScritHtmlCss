import React from "react";
import "./Popup.css"; // Estilos para el popup

const Popup = ({ title, content, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="popup-close">
            ×
          </button>
        </div>
        <div className="popup-body">{content}</div>
      </div>
    </div>
  );
};

export default Popup;
