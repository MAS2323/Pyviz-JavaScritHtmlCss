import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./styles/FloatingButtons.css"; // Import your CSS file here

const FloatingButtons = ({
  onLayerChange,
  onToggleRoadNetwork,
  onToggleEarthView, // Nueva prop
  roadNetworkEnabled,
  earthViewEnabled, // Nuevo estado
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeView, setActiveView] = useState("satellite");
  const [chineseViewOpacity, setChineseViewOpacity] = useState(false); // Estado para opacidad

  const handleViewChange = (viewType, layerType) => {
    setActiveView(viewType);
    // Si es la vista china, activamos la opacidad
    if (viewType === "chinese") {
      setChineseViewOpacity(true);
      // Aquí podrías pasar un parámetro adicional a onLayerChange
      // para indicar que debe aplicarse opacidad
      onLayerChange(layerType, { opacity: 0.7 }); // Ajusta el valor según necesites
    } else {
      setChineseViewOpacity(false);
      onLayerChange(layerType);
    }
    setShowMenu(false);
  };

  const toggleRoadNetwork = () => {
    const newState = !roadNetworkEnabled;
    onToggleRoadNetwork(newState);
  };

  const toggleEarthView = () => {
    const newState = !earthViewEnabled;
    onToggleEarthView(newState);
  };

  return (
    <div className="floating-controls">
      <button
        className="main-floating-button"
        onClick={() => setShowMenu(!showMenu)}
      >
        <i className="fas fa-layer-group"></i>
      </button>

      {showMenu && (
        <div className="view-selector-card">
          <h3>Seleccionar Vista</h3>

          <div className="view-options">
            <div
              className={`view-option ${
                activeView === "satellite" ? "active" : ""
              }`}
              onClick={() => handleViewChange("satellite", "img_w")}
            >
              <i className="fas fa-satellite"></i>
              <span>Satélite</span>
            </div>
            <div
              className={`view-option ${
                activeView === "chinese" ? "active" : ""
              }`}
              onClick={() => handleViewChange("chinese", "cia_w")}
            >
              <i className="fas fa-language"></i>
              <span>Chino</span>
              {chineseViewOpacity && (
                <span className="opacity-badge">Opaco</span>
              )}
            </div>
          </div>

          <div className="additional-options">
            <label className="toggle-option">
              <input
                type="checkbox"
                checked={roadNetworkEnabled}
                onChange={toggleRoadNetwork}
              />
              <span>开启路网 (Red Vial)</span>
            </label>

            {/* Nueva opción para la vista de tierra */}
            <label className="toggle-option">
              <input
                type="checkbox"
                checked={earthViewEnabled}
                onChange={toggleEarthView}
              />
              <span>Vista de Tierra</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingButtons;
