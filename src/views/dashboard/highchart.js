import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const HighChart = ({ title, data = [], yAxisLabel }) => { // ✅ Ensure default value for `data`
  console.log("📊 Chart Data Received in HighChart Component:", data);

  if (!Array.isArray(data) || data.length === 0) {
    console.warn("⚠️ No data available for chart rendering!");
    return <p>No data available</p>; // ✅ Handle empty data case
  }

  const options = {
    chart: { type: "line" },
    title: { text: title, style: { color: "#000" } },
    xAxis: { type: "datetime", title: { text: "Time" } },
    yAxis: { title: { text: yAxisLabel } },
    series: data.map((seriesItem) => ({
      name: seriesItem.name || "Unnamed Series", // ✅ Avoid undefined `name`
      data: seriesItem.data || [], // ✅ Ensure valid data
    })),
    plotOptions: {
      series: { marker: { enabled: true } },
    },
    credits: { enabled: false },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default HighChart;
