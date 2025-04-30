import React, { useEffect, useState } from "react";
import { fetchFibcabState, calculateFibcabParameters } from "../../helpers/api";
import BottleneckIndicator from "../../components/viewer/BottleneckIndicator";
import Popup from "./components/Popup";

const FibcabLeftPanel = ({ data, onClose }) => {
  const [fibcabState, setFibcabState] = useState(null);
  const [fibcabParams, setFibcabParams] = useState(null);
  const [loading, setLoading] = useState({
    state: false,
    params: false,
  });
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    if (data?.sn) {
      setLoading((prev) => ({ ...prev, state: true }));
      const fetchState = async () => {
        try {
          const state = await fetchFibcabState(data.sn);
          setFibcabState(state);
        } catch (error) {
          console.error("获取fibcab状态错误:", error);
        } finally {
          setLoading((prev) => ({ ...prev, state: false }));
        }
      };

      setLoading((prev) => ({ ...prev, params: true }));
      const fetchParams = async () => {
        try {
          const params = await calculateFibcabParameters(data.sn);
          setFibcabParams(params);
        } catch (error) {
          console.error("计算fibcab参数错误:", error);
        } finally {
          setLoading((prev) => ({ ...prev, params: false }));
        }
      };

      fetchState();
      fetchParams();
    }
  }, [data?.sn]);

  const detailedInfo = {
    标识: {
      标签ID: data.tagId || "N/A",
      序列号: data.sn || "N/A",
      组ID: data.gId || "N/A",
    },
    连接: {
      源端: data.source_sn || "N/A",
      目标端: data.target_sn || "N/A",
      源城市: data.source_city || "N/A",
      目标城市: data.target_city || "N/A",
    },
  };

  if (fibcabParams) {
    detailedInfo["技术参数"] = {
      距离: fibcabParams.distance_km
        ? `${fibcabParams.distance_km} 公里`
        : "N/A",
      总衰减: fibcabParams.total_attenuation_db
        ? `${fibcabParams.total_attenuation_db} 分贝`
        : "N/A",
      容量: fibcabParams.fibcab_capacity
        ? `${fibcabParams.fibcab_capacity} 千兆比特/秒`
        : "N/A",
      衰减系数: fibcabParams.attenuation_coefficient_db_per_km
        ? `${fibcabParams.attenuation_coefficient_db_per_km} 分贝/公里`
        : "N/A",
    };
  }

  if (fibcabState) {
    detailedInfo["状态"] = {
      健康点:
        fibcabState.health_point !== null
          ? `${fibcabState.health_point}%`
          : "N/A",
      告警: fibcabState.warnings || "无",
      危机: fibcabState.crisis || "无",
      ...(fibcabState.warnlog_url
        ? {
            告警日志: (
              <span
                style={{ cursor: "pointer", color: "#3498db" }}
                onClick={() =>
                  setPopupData({
                    title: "告警日志",
                    content: (
                      <>
                        <p>告警日志链接: {fibcabState.warnlog_url}</p>
                        <a
                          href={fibcabState.warnlog_url}
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
            ),
          }
        : {}),
      ...(fibcabState.crislog_url
        ? {
            危机日志: (
              <span
                style={{ cursor: "pointer", color: "#3498db" }}
                onClick={() =>
                  setPopupData({
                    title: "危机日志",
                    content: (
                      <>
                        <p>危机日志链接: {fibcabState.crislog_url}</p>
                        <a
                          href={fibcabState.crislog_url}
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
            ),
          }
        : {}),
      ...(fibcabState.rawfile_url
        ? {
            原始数据: (
              <span
                style={{ cursor: "pointer", color: "#3498db" }}
                onClick={() =>
                  setPopupData({
                    title: "原始数据",
                    content: (
                      <>
                        <p>原始数据链接: {fibcabState.rawfile_url}</p>
                        <a
                          href={fibcabState.rawfile_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          下载文件
                        </a>
                      </>
                    ),
                  })
                }
              >
                查看
              </span>
            ),
          }
        : {}),
    };
  }

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
        <h3 style={{ margin: 0, color: "#2c3e50" }}>光纤详情 - {data.sn}</h3>
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

      <hr style={{ margin: "10px 0", borderColor: "#ecf0f1" }} />

      {(loading.state || loading.params) && (
        <div style={{ textAlign: "center", padding: "10px", color: "#7f8c8d" }}>
          加载中...
        </div>
      )}

      {fibcabParams && fibcabState && (
        <BottleneckIndicator
          capacity={fibcabParams.fibcab_capacity}
          health={fibcabState.health_point}
        />
      )}

      {Object.entries(detailedInfo).map(([category, fields]) => (
        <div key={category} style={{ marginBottom: "15px" }}>
          <h4
            style={{
              margin: "0 0 8px 0",
              paddingBottom: "5px",
              borderBottom: "1px solid #ecf0f1",
              color: "#3498db",
            }}
          >
            {category}
          </h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            {Object.entries(fields).map(([label, value]) => (
              <React.Fragment key={label}>
                <div style={{ fontWeight: "bold", color: "#7f8c8d" }}>
                  {label}:
                </div>
                <div style={{ wordBreak: "break-word" }}>
                  {typeof value === "string" ? value : value}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}

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

export default FibcabLeftPanel;
