// components/IolpSection.js
import React from "react";
import InfoSection from "./InfoSection";

const IolpSection = ({ iolpData, setPopupData }) => {
  const fields = [
    { label: "标签ID", value: iolpData.info?.tagId || "N/A" },
    { label: "激活线对", value: iolpData.config?.actived_pairs || "N/A" },
    { label: "未激活线对", value: iolpData.config?.inactived_pairs || "N/A" },
    {
      label: "健康指数",
      value:
        iolpData.state?.health_point !== undefined
          ? `${iolpData.state.health_point}%`
          : "N/A",
    },
    {
      label: "平均光功率",
      value:
        iolpData.state?.opt_pow_mean !== undefined
          ? `${iolpData.state.opt_pow_mean} dBm`
          : "N/A",
    },
    ...(iolpData.state?.warnlog_url
      ? [
          {
            label: "告警日志",
            value: iolpData.state.warnlog_url,
            isLink: true,
          },
        ]
      : []),
  ];

  return (
    <InfoSection
      title="IOLP信息"
      data={iolpData}
      fields={fields}
      setPopupData={setPopupData}
    />
  );
};

export default IolpSection;
