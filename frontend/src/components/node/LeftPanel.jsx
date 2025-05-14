// components/LeftPanel.js
import React, { useEffect, useState, useCallback } from "react";
import {
  fetchIolpInfo,
  fetchIolpConfig,
  fetchIolpState,
  fetchSdhInfo,
  fetchSdhConfig,
  fetchSdhState,
} from "../../helpers/api";
import IolpSection from "./IolpSection";
import SdhSection from "./SdhSection";
import Popup from "./components/Popup";
// import "./LeftPanel.css";

const LeftPanel = ({ data, onClose }) => {
  const [iolpData, setIolpData] = useState({
    info: null,
    config: null,
    state: null,
  });
  const [sdhData, setSdhData] = useState({
    info: null,
    config: null,
    state: null,
  });
  const [loading, setLoading] = useState({
    iolp: false,
    sdh: false,
  });
  const [popupData, setPopupData] = useState(null);

  const fetchAllData = useCallback(async () => {
    if (!data?.sn) return;

    setLoading({ iolp: true, sdh: true });

    try {
      const [iolpInfo, iolpConfig, iolpState, sdhInfo, sdhConfig, sdhState] =
        await Promise.all([
          fetchIolpInfo(data.sn).catch((err) => {
            console.error("获取IOLP信息错误:", err);
            return null;
          }),
          fetchIolpConfig(data.sn).catch((err) => {
            console.error("获取IOLP配置错误:", err);
            return null;
          }),
          fetchIolpState(data.sn).catch((err) => {
            console.error("获取IOLP状态错误:", err);
            return null;
          }),
          fetchSdhInfo(data.sn).catch((err) => {
            console.error("获取SDH信息错误:", err);
            return null;
          }),
          fetchSdhConfig(data.sn).catch((err) => {
            console.error("获取SDH配置错误:", err);
            return null;
          }),
          fetchSdhState(data.sn).catch((err) => {
            console.error("获取SDH状态错误:", err);
            return null;
          }),
        ]);

      setIolpData({ info: iolpInfo, config: iolpConfig, state: iolpState });
      setSdhData({ info: sdhInfo, config: sdhConfig, state: sdhState });
    } catch (error) {
      console.error("获取数据错误:", error);
    } finally {
      setLoading({ iolp: false, sdh: false });
    }
  }, [data?.sn]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <div className="left-panel">
      <div className="left-panel-header">
        <h3>节点详情 - {data?.sn || ""}</h3>
        <button onClick={onClose} className="close-button">
          ×
        </button>
      </div>

      <hr className="divider" />

      {(loading.iolp || loading.sdh) && (
        <div className="loading">正在加载信息...</div>
      )}

      <IolpSection iolpData={iolpData} setPopupData={setPopupData} />
      <SdhSection sdhData={sdhData} setPopupData={setPopupData} />

      {popupData && (
        <Popup
          title={popupData.title}
          content={popupData.content}
          onClose={() => setPopupData(null)}
        />
      )}
    </div>
  );
};

export default LeftPanel;
