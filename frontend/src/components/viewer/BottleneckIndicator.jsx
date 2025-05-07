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
          当前使用率: <strong>{usage_percentage}%</strong> 容量
        </div>
        <div>
          总容量: <strong>{capacity} Gbps</strong>
        </div>
        <div>
          健康度: <strong>{health}%</strong>
        </div>
      </div>

      {fiber_status !== "blue" && (
        <div style={{ marginTop: "10px", fontStyle: "italic" }}>
          建议:{" "}
          {fiber_status === "red" ? "需紧急维护或扩容" : "下次维护时考虑优化"}
        </div>
      )}
    </div>
  );
};

export default BottleneckIndicator;
