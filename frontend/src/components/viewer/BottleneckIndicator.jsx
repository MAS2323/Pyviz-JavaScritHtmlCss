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
          }
        } catch (error) {
          console.error("Error fetching bottlenecks for device:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [deviceSn]);

  const getStatusMessage = () => {
    const status = bottleneckData
      ? bottleneckData.fiber_status || fiber_status
      : fiber_status;
    switch (status) {
      case "red":
        return {
          message: "状态：危急 - 需要立即处理",
          color: "#ff4444",
          icon: "🔴",
        };
      case "yellow":
        return {
          message: "状态：警告 - 请监控",
          color: "#ffbb33",
          icon: "🟡",
        };
      default:
        return {
          message: "状态：正常 - 运行良好",
          color: "#00C851",
          icon: "🔵",
        };
    }
  };

  const status = getStatusMessage();
  const currentCapacity = bottleneckData?.capacity || capacity;
  const currentHealth = bottleneckData?.health || health;
  const currentUsage = bottleneckData?.usage_percentage || usage_percentage;
  const currentFiberStatus = bottleneckData?.fiber_status || fiber_status;

  if (loading) return <div>Loading...</div>;

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
