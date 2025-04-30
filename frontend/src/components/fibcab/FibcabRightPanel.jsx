import React from "react";

const FibcabRightPanel = ({ data }) => {
  const basicInfo = {
    摘要: {
      序列号: data.sn || "N/A",
      类型: data.Type || "光纤",
      状态: data.status || "运行中",
    },
    位置: {
      起始地: data.source_city || "N/A",
      目的地: data.target_city || "N/A",
    },
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
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        padding: "15px",
        zIndex: 1000,
        maxHeight: "40vh",
        overflowY: "auto",
        borderTop: "3px solid #3498db",
      }}
    >
      <h3
        style={{
          margin: "0 0 10px 0",
          color: "#2c3e50",
          textAlign: "center",
        }}
      >
        光纤概要
      </h3>

      {Object.entries(basicInfo).map(([category, fields]) => (
        <div key={category} style={{ marginBottom: "10px" }}>
          <h4
            style={{
              margin: "0 0 5px 0",
              color: "#3498db",
              fontSize: "0.9rem",
            }}
          >
            {category}
          </h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "5px",
            }}
          >
            {Object.entries(fields).map(([label, value]) => (
              <React.Fragment key={label}>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#7f8c8d",
                    fontSize: "0.85rem",
                  }}
                >
                  {label}:
                </div>
                <div style={{ wordBreak: "break-word", fontSize: "0.85rem" }}>
                  {value}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FibcabRightPanel;
