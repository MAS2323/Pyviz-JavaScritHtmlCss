import React from "react";

const BottleneckIndicator = ({ capacity, health }) => {
  if (!capacity || !health) return null;

  const utilization = (health / capacity) * 100;
  let severity = "none";
  let message = "";

  if (utilization > 90) {
    severity = "critical";
    message = "CUELLO DE BOTELLA CRÍTICO";
  } else if (utilization > 80) {
    severity = "warning";
    message = "CUELLO DE BOTELLA";
  } else {
    return null;
  }

  return (
    <div
      style={{
        marginBottom: "15px",
        padding: "10px",
        background: severity === "critical" ? "#ffebee" : "#fff8e1",
        borderRadius: "4px",
        borderLeft: `4px solid ${
          severity === "critical" ? "#f44336" : "#ffc107"
        }`,
        color: severity === "critical" ? "#d32f2f" : "#ff8f00",
        fontWeight: "bold",
      }}
    >
      ⚠️ {message} - Utilización: {utilization.toFixed(2)}%
    </div>
  );
};

export default BottleneckIndicator;
