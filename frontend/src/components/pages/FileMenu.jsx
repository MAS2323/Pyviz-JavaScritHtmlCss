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
import "./styles/FileMenu.css"; // Assuming you have a CSS file for styling
export default function FileMenu() {
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
    if (loading) return <div className="file-menu-loading">Loading...</div>;
    if (error) return <div className="file-menu-error">Error: {error}</div>;
    if (!data || data.length === 0)
      return <div className="file-menu-empty">No data available</div>;

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
    <div className="file-menu-popup right-side">
      <div className="file-menu-container">
        <div className="file-menu-tabs">
          <button
            className={`file-menu-tab ${
              activeTab === "device" ? "active" : ""
            }`}
            onClick={() => setActiveTab("device")}
          >
            Devices
          </button>
          <button
            className={`file-menu-tab ${
              activeTab === "fibcab" ? "active" : ""
            }`}
            onClick={() => setActiveTab("fibcab")}
          >
            FIBCAB
          </button>
          <button
            className={`file-menu-tab ${activeTab === "iolp" ? "active" : ""}`}
            onClick={() => setActiveTab("iolp")}
          >
            IOLP
          </button>
          <button
            className={`file-menu-tab ${
              activeTab === "jmpmat" ? "active" : ""
            }`}
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
            {activeTab.toUpperCase()} Information
          </h3>
          {renderData()}
        </div>
      </div>
    </div>
  );
}
