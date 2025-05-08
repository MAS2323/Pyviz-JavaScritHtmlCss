import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import NetworkGraph from "./NetworkGraph";
import {
  fetchProcessedData,
  fetchDevicesGeoJSON,
  fetchNetworkGeoJSON,
  fetchCesiumConfig,
  getControlFrames,
  getControlFrameValues,
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
    controlFrames: null,
  });
  const [chartTypeDevices, setChartTypeDevices] = useState("pie");
  const [chartTypeProcessed, setChartTypeProcessed] = useState("bar");
  const [dimensions, setDimensions] = useState({ width: 500, height: 400 });
  const [isResizing, setIsResizing] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState("");
  const [timeRange, setTimeRange] = useState("all");
  const [selectedFrameId, setSelectedFrameId] = useState(null);
  const popupRef = useRef(null);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [processedData, devices, network, cesiumConfig, controlFrames] =
        await Promise.all([
          fetchProcessedData(),
          fetchDevicesGeoJSON(),
          fetchNetworkGeoJSON(),
          fetchCesiumConfig(),
          getControlFrames(),
        ]);

      const graphData = processDataForVisualization(
        devices,
        network,
        controlFrames
      );

      setData({
        processedData,
        devices,
        network,
        cesiumConfig,
        graphData,
        controlFrames,
      });
    } catch (error) {
      console.error("加载可视化数据错误:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processDataForVisualization = (devices, network, controlFrames) => {
    const deviceTypes = {};
    devices?.features?.forEach((device) => {
      const type = device.properties?.type || "未知";
      deviceTypes[type] = (deviceTypes[type] || 0) + 1;
    });

    const controlFrameStats = controlFrames?.reduce((acc, frame) => {
      acc[frame.cmdFlg] = (acc[frame.cmdFlg] || 0) + 1;
      return acc;
    }, {});

    return {
      deviceTypes,
      controlFrameStats,
    };
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth =
        e.clientX - popupRef.current.getBoundingClientRect().left;
      const newHeight =
        e.clientY - popupRef.current.getBoundingClientRect().top;
      const minWidth = 300;
      const maxWidth = window.innerWidth * 0.9;
      const minHeight = 200;
      const maxHeight = window.innerHeight * 0.8;

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

  const fetchFrameValues = async (frameId) => {
    try {
      const values = await getControlFrameValues(frameId);
      setData((prev) => ({
        ...prev,
        controlFrames: prev.controlFrames.map((frame) =>
          frame.id === frameId ? { ...frame, values } : frame
        ),
      }));
    } catch (error) {
      console.error("获取控制框架值错误:", error);
    }
  };

  const renderTabContent = () => {
    if (isLoading) {
      return <div className="loading-spinner">数据加载中...</div>;
    }

    switch (activeTab) {
      case "devices":
        const filteredDevices = data.devices?.features?.filter((device) =>
          device.properties?.type
            ?.toLowerCase()
            .includes(deviceFilter.toLowerCase())
        );
        return (
          <div className="tab-content">
            <div className="section">
              <h3>设备</h3>
              <p>设备总数: {filteredDevices?.length || 0}</p>
              <div className="filter-section">
                <label htmlFor="device-filter">按类型过滤:</label>
                <input
                  id="device-filter"
                  type="text"
                  value={deviceFilter}
                  onChange={(e) => setDeviceFilter(e.target.value)}
                  placeholder="输入设备类型..."
                />
              </div>
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
                        height: dimensions.height - 150,
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
              <h3>网络</h3>
              <p>连接总数: {data.network?.features?.length || 0}</p>
              <div className="network-controls">
                <button onClick={() => console.log("放大")}>放大</button>
                <button onClick={() => console.log("缩小")}>缩小</button>
              </div>
              {data.network && (
                <div className="interactive-chart">
                  <NetworkGraph networkData={data.network} />
                </div>
              )}
            </div>
          </div>
        );
      case "controlFrames":
        return (
          <div className="tab-content">
            <div className="section">
              <h3>控制框架</h3>
              <p>框架总数: {data.controlFrames?.length || 0}</p>
              <div className="frame-selector">
                <label htmlFor="frame-selector">选择框架:</label>
                <select
                  id="frame-selector"
                  value={selectedFrameId || ""}
                  onChange={(e) => {
                    const frameId = parseInt(e.target.value);
                    setSelectedFrameId(frameId);
                    if (frameId) fetchFrameValues(frameId);
                  }}
                >
                  <option value="">选择一个框架</option>
                  {data.controlFrames?.map((frame) => (
                    <option key={frame.id} value={frame.id}>
                      框架 {frame.id} - {frame.cmdFlg}
                    </option>
                  ))}
                </select>
              </div>
              {selectedFrameId &&
                data.controlFrames?.find((f) => f.id === selectedFrameId)
                  ?.values && (
                  <div className="frame-details">
                    <h4>框架详情</h4>
                    <pre>
                      {JSON.stringify(
                        data.controlFrames.find((f) => f.id === selectedFrameId)
                          .values,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              {data.graphData?.controlFrameStats && (
                <div className="interactive-chart">
                  <Plot
                    data={[
                      {
                        x: Object.keys(data.graphData.controlFrameStats),
                        y: Object.values(data.graphData.controlFrameStats),
                        type: "bar",
                        marker: { color: "#0066cc" },
                      },
                    ]}
                    layout={{
                      title: "控制框架命令分布",
                      height: dimensions.height - 150,
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
              )}
            </div>
          </div>
        );
      case "processed":
        return (
          <div className="tab-content">
            <div className="section">
              <h3>处理数据</h3>
              <div className="time-range-selector">
                <label htmlFor="time-range">时间范围:</label>
                <select
                  id="time-range"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="all">全部时间</option>
                  <option value="week">最近一周</option>
                  <option value="month">最近一个月</option>
                </select>
              </div>
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
                        height: dimensions.height - 150,
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
    setDimensions({ width: 500, height: 400 });
    setDeviceFilter("");
    setTimeRange("all");
    setSelectedFrameId(null);
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
          网络
        </button>
        <button
          className={activeTab === "controlFrames" ? "active" : ""}
          onClick={() => setActiveTab("controlFrames")}
        >
          控制框架
        </button>
        <button
          className={activeTab === "processed" ? "active" : ""}
          onClick={() => setActiveTab("processed")}
        >
          处理数据
        </button>
      </div>
      <div className="content-container">{renderTabContent()}</div>
      <div className="view-menu-footer">
        <button className="footer-button secondary" onClick={handleReset}>
          重置
        </button>
        <button className="footer-button primary" onClick={closeMenu}>
          完成
        </button>
      </div>
      <div className="resize-handle" onMouseDown={handleMouseDown}></div>
    </div>
  );
}
