import React, { useEffect, useState } from "react";
import { fetchBottlenecks } from "../../helpers/api";

const BottleneckPopup = () => {
  const [bottlenecks, setBottlenecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkBottlenecks = async () => {
      setLoading(true);
      try {
        const data = await fetchBottlenecks();
        setBottlenecks(data || []);
        setVisible((data || []).length > 0);
      } catch (error) {
        console.error("Error fetching bottlenecks:", error);
        setVisible(false);
        setBottlenecks([]);
      } finally {
        setLoading(false);
      }
    };

    // Ejecutar inmediatamente y luego cada 5 minutos
    checkBottlenecks();
    const interval = setInterval(checkBottlenecks, 300000);

    return () => clearInterval(interval);
  }, []);

  const getFiberStatus = (percentage) => {
    if (percentage > 90) return "red"; // crítico
    if (percentage > 70) return "yellow"; // advertencia
    return "blue"; // normal
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "red":
        return {
          message: "Estado CRÍTICO - Necesita atención inmediata",
          icon: "🔴",
        };
      case "yellow":
        return {
          message: "Estado de ADVERTENCIA - Monitorear",
          icon: "🟡",
        };
      default:
        return {
          message: "Estado NORMAL - Operando correctamente",
          icon: "🔵",
        };
    }
  };

  if (!visible || loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1000,
        backgroundColor: "#2c3e50",
        padding: "15px",
        borderRadius: "8px",
        width: "320px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.2rem" }}>
          ⚠️ Alertas de Fibra Óptica
        </h3>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            color: "#ccc",
          }}
        >
          ×
        </button>
      </div>

      <div>
        {bottlenecks.map((bottleneck, index) => {
          const status = getFiberStatus(bottleneck.utilization_percentage);
          const statusMsg = getStatusMessage(status);

          return (
            <div
              key={index}
              style={{
                marginBottom: "15px",
                padding: "12px",
                backgroundColor: `${
                  status === "red"
                    ? "#ff4444"
                    : status === "yellow"
                    ? "#ffbb33"
                    : "#00C851"
                }20`,
                borderLeft: `4px solid ${
                  status === "red"
                    ? "#ff4444"
                    : status === "yellow"
                    ? "#ffbb33"
                    : "#00C851"
                }`,
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <span style={{ fontSize: "18px", marginRight: "8px" }}>
                  {statusMsg.icon}
                </span>
                <strong>{statusMsg.message}</strong>
              </div>

              <div>
                Fibra: <strong>{bottleneck.sn}</strong>
              </div>
              <div>
                Uso:{" "}
                <strong>
                  {bottleneck.usage} / {bottleneck.capacity}
                </strong>
              </div>
              <div>
                Utilización:{" "}
                <strong>{bottleneck.utilization_percentage}%</strong>
              </div>

              {/* Recomendaciones */}
              {status !== "blue" && (
                <div
                  style={{
                    marginTop: "8px",
                    fontStyle: "italic",
                    fontSize: "0.9em",
                    color: "#ddd",
                  }}
                >
                  Recomendación: Considerar reforzar capacidad o redirigir
                  tráfico.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BottleneckPopup;
