import React, { useEffect, useState, useRef } from "react";
import { fetchAllBottlenecks } from "../../helpers/api";
import "./styles/BottleneckPopup.css";

const BottleneckPopup = () => {
  const [bottlenecks, setBottlenecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible] = useState(true);
  const tickerRef = useRef(null);

  useEffect(() => {
    const checkBottlenecks = async () => {
      setLoading(true);
      try {
        const data = await fetchAllBottlenecks();
        setBottlenecks(data || []);
      } catch (error) {
        console.error("获取瓶颈信息失败:", error);
        setBottlenecks([]);
      } finally {
        setLoading(false);
      }
    };

    checkBottlenecks();
    const interval = setInterval(checkBottlenecks, 300000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (ticker && visible) {
      const totalWidth = ticker.scrollWidth;
      const animationDuration = totalWidth / 50;

      const startAnimation = () => {
        ticker.style.animation = "none";
        ticker.offsetHeight;
        ticker.style.animation = `ticker ${animationDuration}s linear forwards`;
      };

      startAnimation();

      const handleAnimationEnd = () => {
        setTimeout(() => {
          startAnimation();
        }, 20000);
      };

      ticker.addEventListener("animationend", handleAnimationEnd);

      return () => {
        ticker.removeEventListener("animationend", handleAnimationEnd);
      };
    }
  }, [bottlenecks, loading]);

  const getFiberStatus = (percentage) => {
    if (percentage > 90) return "red";
    if (percentage > 70) return "yellow";
    return "blue";
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "red":
        return {
          message: "状态：危急 - 需要立即处理",
          icon: "🔴",
          color: "#ff4444",
        };
      case "yellow":
        return {
          message: "状态：警告 - 请监控",
          icon: "🟡",
          color: "#ffbb33",
        };
      default:
        return {
          message: "状态：正常 - 运行良好",
          icon: "🔵",
          color: "#00C851",
        };
    }
  };

  const tickerItems = loading
    ? ["加载中..."]
    : bottlenecks.length > 0
    ? bottlenecks.flatMap((bottleneck, index) => {
        const status = getFiberStatus(bottleneck.utilization_percentage);
        const statusMsg = getStatusMessage(status);
        return [
          `${statusMsg.icon} ${statusMsg.message}`,
          `光纤编号: ${bottleneck.sn}`,
          `使用量: ${bottleneck.usage} / ${bottleneck.capacity}`,
          `利用率: ${bottleneck.utilization_percentage}%`,
          status !== "blue" ? "建议: 考虑提升容量或分流流量" : "",
        ].filter((item) => item);
      })
    : ["🔵 目前没有光纤瓶颈问题 - 系统运行正常"];

  return (
    <div className="bottleneck-popup">
      <div ref={tickerRef} className="ticker-content">
        {tickerItems.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
        {tickerItems.map((item, index) => (
          <span key={`duplicate-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  );
};

export default BottleneckPopup;
