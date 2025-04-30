import React from "react";

const RightPanel = ({ data }) => {
  if (!data) return null;

  const basicInfo = {
    序列号: data.sn,
    组ID: data.gId,
    名称: data.name,
    制造商: data.Producer,
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "300px",
        background: "#1a1a1a",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        padding: "15px",
        zIndex: 1000,
        borderTop: "3px solid #3498db",
      }}
    >
      <h3
        style={{
          margin: "0 0 10px 0",
          color: "#2c3e50",
          fontSize: "1.1rem",
        }}
      >
        基本信息
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {Object.entries(basicInfo).map(([label, value]) => (
          <div key={label} style={{ display: "flex" }}>
            <div
              style={{
                fontWeight: "bold",
                color: "#7f8c8d",
                minWidth: "100px",
              }}
            >
              {label}:
            </div>
            <div
              style={{
                wordBreak: "break-word",
                paddingLeft: "10px",
              }}
            >
              {value || "N/A"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightPanel;
