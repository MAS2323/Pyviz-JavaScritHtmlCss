import React from "react";

const BottleneckIndicator = ({
  capacity,
  health,
  usage_percentage,
  fiber_status,
}) => {
  const getStatusMessage = () => {
    switch (fiber_status) {
      case "red":
        return {
          message: "Estado CRÍTICO - Necesita atención inmediata",
          color: "#ff4444",
          icon: "🔴",
        };
      case "yellow":
        return {
          message: "Estado de ADVERTENCIA - Monitorear",
          color: "#ffbb33",
          icon: "🟡",
        };
      default:
        return {
          message: "Estado NORMAL - Operando correctamente",
          color: "#00C851",
          icon: "🔵",
        };
    }
  };

  const status = getStatusMessage();

  return (
    <div
      style={{
        margin: "10px 0",
        padding: "15px",
        borderRadius: "5px",
        backgroundColor: `${status.color}20`,
        borderLeft: `5px solid ${status.color}`,
        color: "#fff",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        <span style={{ fontSize: "20px", marginRight: "10px" }}>
          {status.icon}
        </span>
        <strong>{status.message}</strong>
      </div>

      <div style={{ marginTop: "10px" }}>
        <div>
          Uso actual: <strong>{usage_percentage}%</strong> de capacidad
        </div>
        <div>
          Capacidad total: <strong>{capacity} Gbps</strong>
        </div>
        <div>
          Punto de salud: <strong>{health}%</strong>
        </div>
      </div>

      {fiber_status !== "blue" && (
        <div style={{ marginTop: "10px", fontStyle: "italic" }}>
          Recomendación:{" "}
          {fiber_status === "red"
            ? "Realizar mantenimiento urgente"
            : "Considerar optimización en próximo mantenimiento"}
        </div>
      )}
    </div>
  );
};

export default BottleneckIndicator;
