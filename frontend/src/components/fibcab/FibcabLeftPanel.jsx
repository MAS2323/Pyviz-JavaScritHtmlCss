import React, { useEffect, useState } from "react";
import {
  fetchFibcabState,
  calculateFibcabParameters,
  fetchFibcabStatus,
} from "../../helpers/api";
import BottleneckIndicator from "../../components/viewer/BottleneckIndicator";
import Popup from "./components/Popup";
import "./styles/FibcabLeftPanel.css";

const FibcabLeftPanel = ({ data, onClose }) => {
  const [fibcabState, setFibcabState] = useState(null);
  const [fibcabParams, setFibcabParams] = useState(null);
  const [fiberStatus, setFiberStatus] = useState(null);
  const [loading, setLoading] = useState({
    state: false,
    params: false,
    status: false,
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
          console.error("Error al obtener estado fibcab:", error);
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
          console.error("Error al calcular parámetros fibcab:", error);
        } finally {
          setLoading((prev) => ({ ...prev, params: false }));
        }
      };

      setLoading((prev) => ({ ...prev, status: true }));
      const fetchStatus = async () => {
        try {
          const status = await fetchFibcabStatus(data.sn);
          setFiberStatus(status);
        } catch (error) {
          console.error("Error al obtener estado de fibra:", error);
        } finally {
          setLoading((prev) => ({ ...prev, status: false }));
        }
      };

      fetchState();
      fetchParams();
      fetchStatus();

      const intervalId = setInterval(() => {
        fetchStatus();
      }, 30000);

      return () => clearInterval(intervalId);
    }
  }, [data?.sn]);

  const getStatusColor = () => {
    if (!fiberStatus) return "#3498db";
    switch (fiberStatus.fiber_color) {
      case "red":
        return "#ff4444";
      case "yellow":
        return "#ffbb33";
      default:
        return "#00C851";
    }
  };

  const getStatusText = () => {
    if (!fiberStatus) return "状态: 加载中...";
    switch (fiberStatus.fiber_color) {
      case "red":
        return "状态: 危急";
      case "yellow":
        return "状态: 警告";
      default:
        return "状态: 正常";
    }
  };

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
                className="link"
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
                className="link"
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
                className="link"
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

  if (fiberStatus) {
    detailedInfo["状态"] = {
      ...detailedInfo["状态"],
      光纤状态: (
        <div className="status-container">
          <div
            className="status-dot"
            style={{ backgroundColor: getStatusColor() }}
          />
          {getStatusText()}
          {fiberStatus.usage_percentage && (
            <span className="usage-percentage">
              (使用率: {fiberStatus.usage_percentage}%)
            </span>
          )}
        </div>
      ),
    };
  }

  return (
    <div className="fibcab-left-panel">
      <div className="panel-header">
        <h3>光纤详情 - {data.sn}</h3>
        <button onClick={onClose} className="close-button">
          ×
        </button>
      </div>

      <hr className="divider" />

      {(loading.state || loading.params || loading.status) && (
        <div className="loading">加载中...</div>
      )}

      {fibcabParams && fibcabState && (
        <BottleneckIndicator
          capacity={fibcabParams.fibcab_capacity}
          health={fibcabState.health_point}
          usage_percentage={fiberStatus?.usage_percentage}
          fiber_status={fiberStatus?.fiber_color}
        />
      )}

      {fiberStatus && (
        <div
          className="status-bar"
          style={{
            backgroundColor: `${getStatusColor()}20`,
            borderLeft: `4px solid ${getStatusColor()}`,
          }}
        >
          <div className="status-content">
            <div
              className="status-dot"
              style={{ backgroundColor: getStatusColor() }}
            />
            <strong>{getStatusText()}</strong>
          </div>
          {fiberStatus.usage_percentage && (
            <div className="usage-text">
              使用率: <strong>{fiberStatus.usage_percentage}%</strong> of
              capacity
            </div>
          )}
        </div>
      )}

      {Object.entries(detailedInfo).map(([category, fields]) => (
        <div key={category} className="info-section">
          <h4 className="category-title">{category}</h4>
          <div className="info-grid">
            {Object.entries(fields).map(([label, value]) => (
              <React.Fragment key={label}>
                <div className="info-label">{label}:</div>
                <div className="info-value">
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
