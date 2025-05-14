import React, { useEffect, useState } from "react";
import { fetchBottlenecks } from "../../helpers/api";

const BottleneckIndicator = ({
  deviceSn,
  capacity,
  health,
  usage_percentage,
  fiber_status,
}) => {
  const [bottleneckData, setBottleneckData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (deviceSn) {
        setLoading(true);
        try {
          const data = await fetchBottlenecks(deviceSn);
          if (data && data.length > 0) {
            setBottleneckData(data[0]); // Use the first bottleneck if multiple are returned
          } else {
            // Si no hay datos de fetchBottlenecks, usar las props como fallback
            setBottleneckData({
              sn: deviceSn,
              capacity: capacity,
              health: health,
              utilization_percentage: usage_percentage,
              fiber_status: fiber_status,
            });
          }
        } catch (error) {
          console.error("Error fetching bottlenecks for device:", error);
          // En caso de error, usar las props como fallback
          setBottleneckData({
            sn: deviceSn,
            capacity: capacity,
            health: health,
            utilization_percentage: usage_percentage,
            fiber_status: fiber_status,
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [deviceSn, capacity, health, usage_percentage, fiber_status]);

  const getStatusMessage = () => {
    const status = bottleneckData?.fiber_status || fiber_status || "green";
    // Mapear "green" a "blue" para consistencia con los estilos CSS y lógica del frontend
    const mappedStatus = status === "green" ? "blue" : status;

    switch (mappedStatus) {
      case "red":
        return {
          message: "状态：危急 - 需要立即处理",
          color: "#ff4444",
          icon: "🔴",
          gradient:
            "linear-gradient(90deg, rgba(255,68,68,0.2), rgba(255,68,68,0.4))",
        };
      case "yellow":
        return {
          message: "状态：警告 - 请监控",
          color: "#ffbb33",
          icon: "🟡",
          gradient:
            "linear-gradient(90deg, rgba(255,187,51,0.2), rgba(255,187,51,0.4))",
        };
      case "blue":
      default:
        return {
          message: "状态：正常 - 运行良好",
          color: "#00C851",
          icon: "🔵",
          gradient:
            "linear-gradient(90deg, rgba(0,200,81,0.2), rgba(0,200,81,0.4))",
        };
    }
  };

  const status = getStatusMessage();
  const currentCapacity = bottleneckData?.capacity || capacity || 0;
  const currentHealth = bottleneckData?.health || health || 0;
  const currentUsage =
    bottleneckData?.utilization_percentage || usage_percentage || 0;
  const currentFiberStatus =
    (bottleneckData?.fiber_status || fiber_status || "green") === "green"
      ? "blue"
      : bottleneckData?.fiber_status || fiber_status;

  if (loading) return <div>Loading...</div>;

  return (
    <div
      className={`bottleneck-indicator ticker-${currentFiberStatus}`}
      style={{
        margin: "10px 0",
        padding: "15px",
        borderRadius: "5px",
        background: status.gradient, // Usar un degradado para más énfasis visual
        borderLeft: `5px solid ${status.color}`,
        color: "#fff",
        boxShadow:
          currentFiberStatus !== "blue"
            ? "0 0 10px rgba(0, 0, 0, 0.3)"
            : "none", // Sombra para estados de alerta/emergencia
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        <span style={{ fontSize: "24px", marginRight: "10px" }}>
          {status.icon}
        </span>
        <strong>{status.message}</strong>
      </div>

      <div style={{ marginTop: "10px" }}>
        <div>
          当前使用率: <strong>{currentUsage}%</strong> 容量
        </div>
        <div>
          总容量: <strong>{currentCapacity} Gbps</strong>
        </div>
        <div>
          健康度: <strong>{currentHealth}%</strong>
        </div>
      </div>

      {currentFiberStatus !== "blue" && (
        <div style={{ marginTop: "10px", fontStyle: "italic" }}>
          建议:{" "}
          {currentFiberStatus === "red"
            ? "需紧急维护或扩容"
            : "下次维护时考虑优化"}
        </div>
      )}
    </div>
  );
};

export default BottleneckIndicator;
