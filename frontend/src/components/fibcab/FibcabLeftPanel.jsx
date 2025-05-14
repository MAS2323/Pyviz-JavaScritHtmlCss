import React, { useEffect, useState, useCallback } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [popupData, setPopupData] = useState(null);

  // Función para obtener todos los datos iniciales
  const fetchAllData = useCallback(async () => {
    if (!data?.sn) return;

    setIsLoading(true);
    try {
      const [state, params, status] = await Promise.all([
        fetchFibcabState(data.sn).catch((err) => {
          console.error("Error al obtener estado fibcab:", err);
          return null;
        }),
        calculateFibcabParameters(data.sn).catch((err) => {
          console.error("Error al calcular parámetros fibcab:", err);
          return null;
        }),
        fetchFibcabStatus(data.sn).catch((err) => {
          console.error("Error al obtener estado de fibra:", err);
          return null;
        }),
      ]);

      setFibcabState(state);
      setFibcabParams(params);
      setFiberStatus(status);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [data?.sn]);

  useEffect(() => {
    fetchAllData();

    // Actualizar datos cada 30 segundos
    const intervalId = setInterval(fetchAllData, 30000);

    return () => clearInterval(intervalId);
  }, [fetchAllData]);

  // Determinar color y texto del estado basado en el status del backend
  const getStatusStyles = () => {
    if (!fiberStatus || !fiberStatus.status) {
      return { color: "#3498db", text: "状态: 加载中..." };
    }

    // Mapear los estados y colores retornados por el backend
    const statusMap = {
      normal: { color: "#00C851", text: "状态: 正常" }, // Verde
      alert: { color: "#ffbb33", text: "状态: 警告" }, // Amarillo
      emergency: { color: "#ff4444", text: "状态: 危急" }, // Rojo
    };

    const status = fiberStatus.status.toLowerCase();
    return statusMap[status] || statusMap.normal;
  };

  // Construcción de la información detallada
  const buildDetailedInfo = () => {
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
        ...(fibcabState.warnlog_url && {
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
        }),
        ...(fibcabState.crislog_url && {
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
        }),
        ...(fibcabState.rawfile_url && {
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
        }),
      };
    }

    if (fiberStatus) {
      const { text, color } = getStatusStyles();
      detailedInfo["状态"] = {
        ...detailedInfo["状态"],
        光纤状态: (
          <div className="status-container">
            <div className="status-dot" style={{ backgroundColor: color }} />
            {text}
            {fiberStatus.usage_percentage !== undefined && (
              <span className="usage-percentage">
                (使用率: {fiberStatus.usage_percentage}%)
              </span>
            )}
          </div>
        ),
      };
    }

    return detailedInfo;
  };

  const detailedInfo = buildDetailedInfo();
  const { color: statusColor, text: statusText } = getStatusStyles();

  return (
    <div className="fibcab-left-panel">
      <div className="panel-header">
        <h3>光纤详情 - {data.sn}</h3>
        <button onClick={onClose} className="close-button">
          ×
        </button>
      </div>

      <hr className="divider" />

      {isLoading && <div className="loading">加载中...</div>}

      {fibcabParams && fibcabState && fiberStatus && (
        <BottleneckIndicator
          capacity={fibcabParams.fibcab_capacity}
          health={fibcabState.health_point}
          usage_percentage={fiberStatus.usage_percentage}
          fiber_status={fiberStatus.status} // Usar status para consistencia
        />
      )}

      {fiberStatus && (
        <div
          className="status-bar"
          style={{
            backgroundColor: `${statusColor}20`,
            borderLeft: `4px solid ${statusColor}`,
          }}
        >
          <div className="status-content">
            <div
              className="status-dot"
              style={{ backgroundColor: statusColor }}
            />
            <strong>{statusText}</strong>
          </div>
          {fiberStatus.usage_percentage !== undefined && (
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
