import React, { useState, useEffect } from "react";
import { fetchCpuUsage } from "../../helpers/api";
import "./styles/CpuViewer.css";

const CpuViewer = ({ closeMenu }) => {
  const [cpuData, setCpuData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const loadCpuData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCpuUsage();
      setCpuData(data);
      setRetryCount(0); // Reset retries on success
    } catch (err) {
      if (retryCount < maxRetries) {
        setRetryCount(retryCount + 1);
        setTimeout(loadCpuData, 2000); // Retry after 2 seconds
      } else {
        setError("无法获取 CPU 使用数据，请稍后重试");
        setCpuData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCpuData();
  }, []);

  return (
    <div className="cpu-viewer-popup">
      <div className="cpu-viewer-header">
        <h2>CPU 使用率</h2>
        <button className="close-button" onClick={closeMenu} aria-label="关闭">
          ×
        </button>
      </div>
      <div className="cpu-viewer-content">
        <h3 className="cpu-viewer-title">CPU 使用信息</h3>
        {loading && <div className="cpu-viewer-loading">加载中...</div>}
        {error && <div className="cpu-viewer-error">错误: {error}</div>}
        {cpuData && (
          <div className="cpu-viewer-data">
            <p>
              <strong>平均 CPU 使用率:</strong>{" "}
              {cpuData.avg_cpu_usage.toFixed(2)}%
            </p>
            <p>
              <strong>最大 CPU 使用率:</strong>{" "}
              {cpuData.max_cpu_usage.toFixed(2)}%
            </p>
            <p>
              <strong>任务结果:</strong> {cpuData.task_result.result}
            </p>
            {cpuData.cpu_usage_plot && (
              <img
                src={`data:image/png;base64,${cpuData.cpu_usage_plot}`}
                alt="CPU Usage Plot"
                className="cpu-viewer-plot"
              />
            )}
            <button
              onClick={loadCpuData}
              className="cpu-viewer-refresh"
              disabled={loading}
            >
              刷新
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CpuViewer;
