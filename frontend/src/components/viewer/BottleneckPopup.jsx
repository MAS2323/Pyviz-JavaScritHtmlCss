import React, { useEffect, useState } from "react";
import { fetchBottlenecks } from "../helpers/api";

const BottleneckPopup = () => {
  const [bottlenecks, setBottlenecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkBottlenecks = async () => {
      setLoading(true);
      try {
        const data = await fetchBottlenecks();
        setBottlenecks(data);
        setVisible(data.length > 0);
      } catch (error) {
        console.error("检查网络瓶颈错误:", error);
      } finally {
        setLoading(false);
      }
    };

    // 每5分钟检查一次 (300000 ms)
    checkBottlenecks();
    const interval = setInterval(checkBottlenecks, 300000);

    return () => clearInterval(interval);
  }, []);

  if (!visible || loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "350px",
        background: "#0009",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
        padding: "15px",
        zIndex: 1000,
        borderLeft: "5px solid #e74c3c",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, color: "#e74c3c" }}>检测到网络瓶颈</h3>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            color: "#7f8c8d",
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginTop: "10px" }}>
        {bottlenecks.map((bottleneck, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              padding: "10px",
              background: "#0009",
              borderRadius: "4px",
            }}
          >
            <div style={{ fontWeight: "bold" }}>光纤: {bottleneck.sn}</div>
            <div>
              使用量: {bottleneck.usage} / {bottleneck.capacity}
            </div>
            <div>利用率: {bottleneck.utilization_percentage}%</div>
            <div
              style={{
                color:
                  bottleneck.utilization_percentage > 90
                    ? "#e74c3c"
                    : "#f39c12",
                fontWeight: "bold",
              }}
            >
              {bottleneck.utilization_percentage > 90 ? "严重告警" : "警告"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottleneckPopup;
