import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import NetworkGraph from "./NetworkGraph";
import {
  fetchProcessedData,
  fetchDevicesGeoJSON,
  fetchNetworkGeoJSON,
  fetchCesiumConfig,
} from "../../helpers/api";
import "./styles/ViewMenu.css";

export default function ViewMenu({ closeMenu }) {
  const [activeTab, setActiveTab] = useState("devices");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    processedData: null,
    devices: null,
    network: null,
    cesiumConfig: null,
    graphData: null,
  });
  const [chartTypeDevices, setChartTypeDevices] = useState("pie");
  const [chartTypeProcessed, setChartTypeProcessed] = useState("bar");
  const [dimensions, setDimensions] = useState({ width: 500, height: 400 }); // 初始尺寸
  const [isResizing, setIsResizing] = useState(false);
  const popupRef = useRef(null);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [processedData, devices, network, cesiumConfig] = await Promise.all(
        [
          fetchProcessedData(),
          fetchDevicesGeoJSON(),
          fetchNetworkGeoJSON(),
          fetchCesiumConfig(),
        ]
      );

      const graphData = processDataForVisualization(devices, network);

      setData({
        processedData,
        devices,
        network,
        cesiumConfig,
        graphData,
      });
    } catch (error) {
      console.error("加载可视化数据错误:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processDataForVisualization = (devices, network) => {
    const deviceTypes = {};
    devices?.features?.forEach((device) => {
      const type = device.properties?.type || "未知";
      deviceTypes[type] = (deviceTypes[type] || 0) + 1;
    });

    return {
      deviceTypes,
    };
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // 处理窗口大小调整
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const newWidth =
        e.clientX - popupRef.current.getBoundingClientRect().left;
      const newHeight =
        e.clientY - popupRef.current.getBoundingClientRect().top;

      // 强制最小和最大尺寸
      const minWidth = 300;
      const maxWidth = window.innerWidth * 0.9; // 视口宽度的90%
      const minHeight = 200;
      const maxHeight = window.innerHeight * 0.8; // 视口高度的80%

      setDimensions({
        width: Math.max(minWidth, Math.min(newWidth, maxWidth)),
        height: Math.max(minHeight, Math.min(newHeight, maxHeight)),
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const renderTabContent = () => {
    if (isLoading) {
      return <div className="loading-spinner">数据加载中...</div>;
    }

    switch (activeTab) {
      case "devices":
        return (
          <div className="tab-content">
            <div className="section">
              <h3>设备</h3>
              <p>设备总数: {data.devices?.features?.length || 0}</p>
              {data.graphData?.deviceTypes && (
                <>
                  <div className="chart-type-selector">
                    <label htmlFor="chart-type-devices">图表类型:</label>
                    <select
                      id="chart-type-devices"
                      value={chartTypeDevices}
                      onChange={(e) => setChartTypeDevices(e.target.value)}
                    >
                      <option value="pie">饼图</option>
                      <option value="bar">柱状图</option>
                      <option value="line">折线图</option>
                      <option value="scatter">散点图</option>
                    </select>
                  </div>
                  <div className="interactive-chart">
                    <Plot
                      data={[
                        {
                          values: Object.values(data.graphData.deviceTypes),
                          labels: Object.keys(data.graphData.deviceTypes),
                          type: chartTypeDevices,
                          hoverinfo: "label+percent",
                          textinfo:
                            chartTypeDevices === "pie" ? "value" : undefined,
                          marker: { color: "#0066cc" },
                        },
                      ]}
                      layout={{
                        title: "设备类型分布",
                        height: dimensions.height - 150, // 根据弹出窗口高度调整图表高度
                        width: "auto",
                        margin: { t: 40, b: 40, l: 40, r: 40 },
                        paper_bgcolor: "rgba(0,0,0,0)",
                        plot_bgcolor: "rgba(0,0,0,0)",
                        font: { color: "#eee" },
                      }}
                      useResizeHandler={true}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );
      case "network":
        return (
          <div className="tab-content">
            <div className="section">
              <h3>光纤网络</h3>
              <p>连接总数: {data.network?.features?.length || 0}</p>
              {data.network && (
                <div className="interactive-chart">
                  <NetworkGraph networkData={data.network} />
                </div>
              )}
            </div>
          </div>
        );
      case "combined":
        return (
          <div className="tab-content">
            <div className="section">
              <h3>综合视图</h3>
              <p>Cesium配置已加载。</p>
              <button className="action-button">在Cesium中可视化</button>
            </div>
          </div>
        );
      case "processed":
        return (
          <div className="tab-content">
            <div className="section">
              <h3>处理数据</h3>
              {data.processedData && (
                <>
                  <div className="chart-type-selector">
                    <label htmlFor="chart-type-processed">图表类型:</label>
                    <select
                      id="chart-type-processed"
                      value={chartTypeProcessed}
                      onChange={(e) => setChartTypeProcessed(e.target.value)}
                    >
                      <option value="bar">柱状图</option>
                      <option value="line">折线图</option>
                      <option value="scatter">散点图</option>
                      <option value="area">面积图</option>
                    </select>
                  </div>
                  <div className="interactive-chart">
                    <Plot
                      data={[
                        {
                          type: chartTypeProcessed,
                          x: Object.keys(data.processedData),
                          y: Object.values(data.processedData),
                          marker: { color: "#0066cc" },
                          fill:
                            chartTypeProcessed === "area" ? "tozeroy" : "none",
                        },
                      ]}
                      layout={{
                        title: "处理数据",
                        height: dimensions.height - 150, // 根据弹出窗口高度调整图表高度
                        width: "auto",
                        margin: { t: 40, b: 40, l: 40, r: 40 },
                        paper_bgcolor: "rgba(0,0,0,0)",
                        plot_bgcolor: "rgba(0,0,0,0)",
                        font: { color: "#eee" },
                      }}
                      useResizeHandler={true}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );
      default:
        return <div>请选择视图</div>;
    }
  };

  const handleReset = () => {
    setChartTypeDevices("pie");
    setChartTypeProcessed("bar");
    setActiveTab("devices");
    setDimensions({ width: 500, height: 400 }); // 重置尺寸
  };

  return (
    <div
      className="view-menu"
      ref={popupRef}
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
      }}
    >
      <div className="view-menu-header">
        <h2>视图设置</h2>
        <button className="close-button" onClick={closeMenu} aria-label="关闭">
          ×
        </button>
      </div>
      <div className="tabs">
        <button
          className={activeTab === "devices" ? "active" : ""}
          onClick={() => setActiveTab("devices")}
        >
          设备
        </button>
        <button
          className={activeTab === "network" ? "active" : ""}
          onClick={() => setActiveTab("network")}
        >
          光纤
        </button>
        <button
          className={activeTab === "combined" ? "active" : ""}
          onClick={() => setActiveTab("combined")}
        >
          IOLP
        </button>
        <button
          className={activeTab === "processed" ? "active" : ""}
          onClick={() => setActiveTab("processed")}
        >
          JMPMAT
        </button>
      </div>
      <div className="content-container">{renderTabContent()}</div>
      <div className="view-menu-footer">
        <button className="footer-button secondary" onClick={handleReset}>
          恢复默认
        </button>
        <button className="footer-button primary" onClick={closeMenu}>
          完成
        </button>
      </div>
      <div className="resize-handle" onMouseDown={handleMouseDown}></div>
    </div>
  );
}
