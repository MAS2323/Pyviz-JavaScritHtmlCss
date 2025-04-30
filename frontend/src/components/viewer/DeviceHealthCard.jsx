import React from "react";
import StatusIndicator from "../common/StatusIndicator";

const DeviceHealthCard = ({ device, healthData }) => {
  if (!healthData) return null;

  const status =
    healthData.health_point < 30
      ? "critical"
      : healthData.health_point < 60
      ? "warning"
      : "normal";

  return (
    <div className="health-card">
      <div className="card-header">
        <h3>{device.name}</h3>
        <StatusIndicator status={status} />
      </div>

      <div className="health-metrics">
        <div className="metric">
          <span className="label">健康指数:</span>
          <span className="value">{healthData.health_point}/100</span>
        </div>

        <div className="metric">
          <span className="label">状态:</span>
          <span className={`status ${status}`}>{healthData.status}</span>
        </div>

        <div className="metric">
          <span className="label">光功率:</span>
          <span className="value">{healthData.opt_pow_mean} dBm</span>
        </div>
      </div>

      <div className="log-links">
        <a
          href={healthData.warnlog_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          查看告警日志
        </a>
        <a
          href={healthData.crislog_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          查看危机日志
        </a>
      </div>
    </div>
  );
};

export default DeviceHealthCard;
