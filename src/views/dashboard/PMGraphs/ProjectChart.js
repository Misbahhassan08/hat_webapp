import React, { useEffect, useState, useRef } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function ProjectChart() {
  const { gateway_name = "Dummy Gateway", value_name = "Dummy Value" } = useParams();
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(6, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [unit, setUnit] = useState("kW");

  useEffect(() => {
    const generateDummyDailyData = () => {
      const seriesNames = ["Consumption", "Production", "Export"];
      const newSeries = seriesNames.map((name) => ({
        name,
        data: [],
      }));

      let currentDate = dayjs(startDate);
      while (currentDate.isBefore(endDate.add(1, "day"))) {
        const dateStr = currentDate.format("YYYY-MM-DD");

        newSeries[0].data.push({ name: dateStr, y: Math.floor(Math.random() * 100) }); // Consumption
        newSeries[1].data.push({ name: dateStr, y: Math.floor(Math.random() * 70) });  // Production
        newSeries[2].data.push({ name: dateStr, y: Math.floor(Math.random() * 30) });  // Export

        currentDate = currentDate.add(1, "day");
      }

      setChartData(newSeries);
    };

    generateDummyDailyData();
  }, [startDate, endDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
          <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
        </div>

        <DailyChart
          title=""
          data={chartData}
          yAxisLabel={unit}
        />
      </div>
    </LocalizationProvider>
  );
}

function DailyChart({ title, data, yAxisLabel }) {
  const chartRef = useRef(null);

  const options = {
    chart: {
      type: "spline",
      backgroundColor: "white", // ✅ Set white background
      
    },
    title: { text: title },
    xAxis: {
      type: "category",
      title: { text: "Date" },
      labels: { rotation: -45, style: { fontSize: "12px" } },
      lineWidth: 1,
    },
    yAxis: {
      title: { text: yAxisLabel },
      gridLineWidth: 1,
      lineWidth: 1,
    },
    series: data,
    credits: { enabled: false },
    plotOptions: {
      series: {
        animation: { duration: 600 },
        marker: {
          enabled: false, // 🔴 Disable dots (markers)
        },
      },
    },
  };
  

 return (
    <div
      style={{
        borderRadius: "10px",
        overflow: "hidden", // Ensures inner chart respects border radius
        boxShadow: "0 0 10px rgba(0,0,0,0.1)", // Optional for visual polish
      }}
    >
      <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
    </div>
  );}



export default ProjectChart;
