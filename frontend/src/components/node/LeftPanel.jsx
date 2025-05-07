import React, { useEffect, useState } from "react";
import {
  fetchIolpInfo,
  fetchIolpConfig,
  fetchIolpState,
} from "../../helpers/api";
import Popup from "./components/Popup"; 

const LeftPanel = ({ data, onClose }) => {
  const [iolpData, setIolpData] = useState({
    info: null,
    config: null,
    state: null,
  });
  const [loading, setLoading] = useState(false);
  const [popupData, setPopupData] = useState(null); 

  useEffect(() => {
    if (!data?.sn) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [info, config, state] = await Promise.all([
          fetchIolpInfo(data.sn),
          fetchIolpConfig(data.sn),
          fetchIolpState(data.sn),
        ]);
        setIolpData({ info, config, state });
      } catch (error) {
        console.error("获取IOLP数据错误:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [data?.sn]);

  const renderIolpSection = () => {
    if (!iolpData.info && !iolpData.config && !iolpData.state) return null;

    return (
      <div style={{ marginBottom: "20px" }}>
        <h4
          style={{
            margin: "0 0 10px 0",
            color: "#3498db",
            fontSize: "1rem",
          }}
        >
          IOLP信息
        </h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
          }}
        >
          {/* 基本信息 */}
          <div
            style={{ fontWeight: "bold", color: "#7f8c8d", fontSize: "0.9rem" }}
          >
            标签ID:
          </div>
          <div style={{ wordBreak: "break-word", fontSize: "0.9rem" }}>
            {iolpData.info?.tagId || "N/A"}
          </div>

          {/* 配置信息 */}
          <div
            style={{ fontWeight: "bold", color: "#7f8c8d", fontSize: "0.9rem" }}
          >
            激活线对:
          </div>
          <div style={{ wordBreak: "break-word", fontSize: "0.9rem" }}>
            {iolpData.config?.actived_pairs || "N/A"}
          </div>

          <div
            style={{ fontWeight: "bold", color: "#7f8c8d", fontSize: "0.9rem" }}
          >
            未激活线对:
          </div>
          <div style={{ wordBreak: "break-word", fontSize: "0.9rem" }}>
            {iolpData.config?.inactived_pairs || "N/A"}
          </div>

          {/* 状态信息 */}
          <div
            style={{ fontWeight: "bold", color: "#7f8c8d", fontSize: "0.9rem" }}
          >
            健康指数:
          </div>
          <div style={{ wordBreak: "break-word", fontSize: "0.9rem" }}>
            {iolpData.state?.health_point !== undefined
              ? `${iolpData.state.health_point}%`
              : "N/A"}
          </div>

          <div
            style={{ fontWeight: "bold", color: "#7f8c8d", fontSize: "0.9rem" }}
          >
            平均光功率:
          </div>
          <div style={{ wordBreak: "break-word", fontSize: "0.9rem" }}>
            {iolpData.state?.opt_pow_mean !== undefined
              ? `${iolpData.state.opt_pow_mean} dBm`
              : "N/A"}
          </div>

          {/* 日志链接 */}
          {iolpData.state?.warnlog_url && (
            <>
              <div
                style={{
                  fontWeight: "bold",
                  color: "#7f8c8d",
                  fontSize: "0.9rem",
                }}
              >
                告警日志:
              </div>
              <div style={{ wordBreak: "break-word", fontSize: "0.9rem" }}>
                <span
                  style={{ cursor: "pointer", color: "#3498db" }}
                  onClick={() =>
                    setPopupData({
                      title: "告警日志",
                      content: (
                        <>
                          <p>告警日志链接: {iolpData.state.warnlog_url}</p>
                          <a
                            href={iolpData.state.warnlog_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            查看日志
                          </a>
                        </>
                      ),
                    })
                  }
                >
                  查看
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "70px",
        left: "20px",
        width: "450px",
        background: "#1a1a1a",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        padding: "15px",
        zIndex: 1000,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, color: "#2c3e50" }}>
          IOLP详情 - {data?.sn || ""}
        </h3>
        <button
          onClick={onClose}
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

      <hr style={{ margin: "10px 0", borderColor: "#eee" }} />

      {loading && (
        <div style={{ textAlign: "center", padding: "10px", color: "#7f8c8d" }}>
          正在加载IOLP信息...
        </div>
      )}

      {renderIolpSection()}

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
