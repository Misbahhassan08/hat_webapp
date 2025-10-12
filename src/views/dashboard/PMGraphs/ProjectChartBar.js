import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Typography, useTheme, LinearProgress } from "@mui/material";

const ProjectChartBar = () => {
  const categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const theme = useTheme();

  const gridData = [20, 30, 25, 35, 40, 45, 30];
  const solarData = [15, 20, 18, 22, 25, 30, 20];
  const gensetData = [10, 5, 8, 12, 15, 10, 5];

  const textColor = "#AFB2C1";

  const options = {
    chart: {
      type: "column",
      borderRadius: "10px",
      height: 280,
      backgroundColor: {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
        stops: [
          [0, "#39406D"],
          [1, "#1D2137"],
        ],
      },
      style: { fontFamily: "Arial, sans-serif" },
    },
    title: {
      text: "",
    },
    xAxis: {
      categories,
      crosshair: true,
      lineColor: textColor,
      labels: {
        style: { color: textColor, fontSize: "10px" },
      },
    },
    yAxis: {
      min: 0,
      gridLineWidth: 0,
      title: {
        text: "",
      },
      labels: {
        style: { color: textColor, fontSize: "10px" },
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      backgroundColor: "#2a2e4a",
      borderColor: "#444",
      style: { color: textColor, fontSize: "11px" },
      headerFormat: '<b style="font-size:12px;">{point.key}</b><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0 6px 0 0;">{series.name}:</td>' +
        '<td style="padding:0"><b>{point.y} kW</b></td></tr>',
      footerFormat: "</table>",
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        grouping: true,
        states: {
          hover: {
            enabled: false,
          },
        },
      },
    },
    colors: ["#ffffff", "#28a745", "#6f42c1"],
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
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <div
      style={{
        padding: 8,
        borderRadius: "10px",
        width: "100%",
        height: "100%",
      }}
    >
      <Box mb={2}>
        <Typography variant="subtitle2" fontWeight={600} fontSize={14} mb={1}>
          Last 7 Days Consumption (kWh)
        </Typography>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} fontSize={14} mb={1.5}>
          Current Consumption (kW)
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection={'row'}
          gap={1}
        >
          {/* Shared Progress Card */}
          {[
            { label: "Load", value: 72, color: "orange" },
            { label: "Grid", value: 45, color: "#39406D" },
            { label: "Solar", value: 30, color: "#28a745" },
            { label: "Genset", value: 10, color: "#6f42c1" },
          ].map(({ label, value, color }) => (
<Box
  key={label}
  flex={1}
  minWidth="120px"
  sx={{ maxWidth: "160px" }}
>
  <Box display="flex" alignItems="center" gap={0.75}>
    <Box
      width={12}
      height={12}
      bgcolor={color}
      borderRadius="2px"
      boxShadow="0px 0px 6px rgba(0,0,0,0.4)" // ✅ shadow for colored square
    />
    <Typography fontSize={13} fontWeight={700}>{label}</Typography> {/* ✅ larger label text */}
  </Box>
  <Typography fontWeight={700} mt={0.5} variant="h6">
    {value} kW
  </Typography> {/* ✅ larger value text */}
  <LinearProgress
    variant="determinate"
    value={value}
    sx={{
      height: 4, // ✅ smaller height
      borderRadius: 5,
      mt: 0.5,
      width:'50%',
      backgroundColor: "#2f2f2f",
      "& .MuiLinearProgress-bar": {
        backgroundColor: color,
      },
    }}
  />
</Box>

          ))}
        </Box>
      </Box>
    </div>
  );
};

export default ProjectChartBar;
