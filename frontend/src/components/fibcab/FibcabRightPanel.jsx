import React from "react";
import "./styles/FibcabRightPanel.css";

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
    <div className="fibcab-right-panel">
      <h3 className="panel-title">光纤概要</h3>
      {Object.entries(basicInfo).map(([category, fields]) => (
        <div key={category} className="info-section">
          <h4 className="category-title">{category}</h4>
          <div className="info-grid">
            {Object.entries(fields).map(([label, value]) => (
              <React.Fragment key={label}>
                <div className="info-label">{label}:</div>
                <div className="info-value">{value}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FibcabRightPanel;
