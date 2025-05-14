// components/SdhSection.js
import React from "react";
import InfoSection from "./InfoSection";

const SdhSection = ({ sdhData, setPopupData }) => {
  const fields = [
    { label: "标签ID", value: sdhData.info?.tagId || "N/A" },
    { label: "设备类型", value: sdhData.info?.Type || "N/A" },
    { label: "方向1名称", value: sdhData.config?.opt1_dir_name || "N/A" },
    { label: "方向1传输类型", value: sdhData.config?.opt1_trans_type || "N/A" },
    { label: "方向1流量", value: sdhData.config?.opt1_traffic || "N/A" },
    { label: "方向2名称", value: sdhData.config?.opt2_dir_name || "N/A" },
    { label: "方向2传输类型", value: sdhData.config?.opt2_trans_type || "N/A" },
    { label: "方向2流量", value: sdhData.config?.opt2_traffic || "N/A" },
    {
      label: "健康指数",
      value:
        sdhData.state?.health_point !== undefined
          ? `${sdhData.state.health_point}%`
          : "N/A",
    },
    { label: "告警", value: sdhData.state?.warnings || "无" },
    { label: "危机", value: sdhData.state?.crisis || "无" },
    ...(sdhData.state?.warnlog_url
      ? [
          {
            label: "告警日志",
            value: sdhData.state.warnlog_url,
            isLink: true,
          },
        ]
      : []),
    ...(sdhData.state?.crislog_url
      ? [
          {
            label: "危机日志",
            value: sdhData.state.crislog_url,
            isLink: true,
          },
        ]
      : []),
    ...(sdhData.state?.rawfile_url
      ? [
          {
            label: "原始数据",
            value: sdhData.state.rawfile_url,
            isLink: true,
          },
        ]
      : []),
  ];

  return (
    <InfoSection
      title="SDH信息"
      data={sdhData}
      fields={fields}
      setPopupData={setPopupData}
    />
  );
};

export default SdhSection;
