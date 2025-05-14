// components/InfoSection.js
import React from "react";
// import Popup from "./Popup";

const InfoSection = ({ title, data, fields, setPopupData }) => {
  if (!data || Object.values(data).every((item) => !item)) return null;

  return (
    <div className="section">
      <h4 className="section-title">{title}</h4>
      <div className="section-grid">
        {fields.map(({ label, value, isLink }) => (
          <React.Fragment key={label}>
            <div className="label">{label}:</div>
            <div className="value">
              {isLink ? (
                <span
                  className="link"
                  onClick={() =>
                    setPopupData({
                      title,
                      content: (
                        <>
                          <p>{`${label}链接: ${value}`}</p>
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {label.includes("原始数据")
                              ? "下载文件"
                              : "查看日志"}
                          </a>
                        </>
                      ),
                    })
                  }
                >
                  查看
                </span>
              ) : (
                value
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default InfoSection;
