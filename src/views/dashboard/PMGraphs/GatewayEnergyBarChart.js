import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const GatewayEnergyBarChart = () => {
  const categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Dummy data
  const gridData = [20, 30, 25, 35, 40, 45, 30];
  const solarData = [15, 20, 18, 22, 25, 30, 20];
  const gensetData = [10, 5, 8, 12, 15, 10, 5];

  const options = {
    chart: {
      type: "column",
      backgroundColor: "#fff",
      style: { fontFamily: "Arial, sans-serif" },
    },
    title: {
      text: "Weekly Power Source Usage",
    },
    xAxis: {
      categories,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Power (kW)",
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<b>{point.key}</b><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y} kW</b></td></tr>',
      footerFormat: "</table>",
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        grouping: true,
      },
    },
    colors: ["#ffffff", "#28a745", "#6f42c1"], // White, Green, Purple
    series: [
      {
        name: "Grid",
        data: gridData,
        color: "#ffffff",
        borderColor: "#000",
      },
      {
        name: "Solar",
        data: solarData,
        color: "#28a745",
      },
      {
        name: "Genset",
        data: gensetData,
        color: "#6f42c1",
      },
    ],
  };

  return (
    <div style={{ padding: 20 }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default GatewayEnergyBarChart;
