import React, { useState, useEffect } from "react";
import {
  fetchAllDevices,
  fetchFibcabsForDevice,
  fetchIolpInfo,
  fetchAllFibcabs,
  fetchAllJmpmats,
  fetchSdhInfo,
  fetchTraffstubInfo,
} from "../../helpers/api";
import "./styles/FileMenu.css";

export default function FileMenu({ closeMenu }) {
  const [activeTab, setActiveTab] = useState("device");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      let result;

      switch (activeTab) {
        case "device":
          result = await fetchAllDevices();
          break;
        case "fibcab":
          result = await fetchAllFibcabs();
          break;
        case "iolp":
          result = await fetchIolpInfo();
          result = result ? [result] : [];
          break;
        case "jmpmat":
          result = await fetchAllJmpmats();
          break;
        case "sdh":
          result = await fetchSdhInfo("sample-sdh-sn");
          result = result ? [result] : [];
          break;
        case "traffstub":
          result = await fetchTraffstubInfo("sample-traffstub-sn");
          result = result ? [result] : [];
          break;
        default:
          result = [];
      }

      setData(result);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const renderData = () => {
    if (loading) return <div className="file-menu-loading">加载中...</div>;
    if (error) return <div className="file-menu-error">错误: {error}</div>;
    if (!data || data.length === 0)
      return <div className="file-menu-empty">无数据可用</div>;

    return (
      <div className="file-menu-table-container">
        <table className="file-menu-table">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, i) => (
                  <td key={i}>{String(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="file-menu-popup">
      <div className="file-menu-header">
        <h2>文件菜单</h2>
        <button className="close-button" onClick={closeMenu} aria-label="关闭">
          ×
        </button>
      </div>
      <div className="file-menu-tabs">
        <button
          className={`file-menu-tab ${activeTab === "device" ? "active" : ""}`}
          onClick={() => setActiveTab("device")}
        >
          设备
        </button>
        <button
          className={`file-menu-tab ${activeTab === "fibcab" ? "active" : ""}`}
          onClick={() => setActiveTab("fibcab")}
        >
          光纤柜
        </button>
        <button
          className={`file-menu-tab ${activeTab === "iolp" ? "active" : ""}`}
          onClick={() => setActiveTab("iolp")}
        >
          IOLP
        </button>
        <button
          className={`file-menu-tab ${activeTab === "jmpmat" ? "active" : ""}`}
          onClick={() => setActiveTab("jmpmat")}
        >
          JMPMAT
        </button>
        <button
          className={`file-menu-tab ${activeTab === "sdh" ? "active" : ""}`}
          onClick={() => setActiveTab("sdh")}
        >
          SDH
        </button>
        <button
          className={`file-menu-tab ${
            activeTab === "traffstub" ? "active" : ""
          }`}
          onClick={() => setActiveTab("traffstub")}
        >
          TRAFFSTUB
        </button>
      </div>
      <div className="file-menu-content">
        <h3 className="file-menu-title">
          {activeTab === "device" && "设备信息"}
          {activeTab === "fibcab" && "光纤柜信息"}
          {activeTab === "iolp" && "IOLP 信息"}
          {activeTab === "jmpmat" && "JMPMAT 信息"}
          {activeTab === "sdh" && "SDH 信息"}
          {activeTab === "traffstub" && "TRAFFSTUB 信息"}
        </h3>
        {renderData()}
      </div>
    </div>
  );
}
