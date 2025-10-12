import React, { useEffect, useState, useRef } from "react";
import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import urls from "../../urls/urls";

function ProjectChart() {
  const { gateway_name, value_name } = useParams();
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(29, 'day'));
  const [endDate, setEndDate] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [unit, setUnit] = useState("kW");

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const from_date = startDate.format("YYYY-MM-DD");
        const to_date = endDate.format("YYYY-MM-DD");
        const response = await fetch(
          `${urls.fetch_highchart_data}?gateway=${gateway_name}&value_name=${value_name}&from_date=${from_date}&to_date=${to_date}`
        );
        const json = await response.json();

        const dateMap = {};
        let currentDate = dayjs(startDate);
        while (currentDate.isBefore(endDate.add(1, "day"))) {
          dateMap[currentDate.format("YYYY-MM-DD")] = 0;
          currentDate = currentDate.add(1, "day");
        }

        let tempUnit = null;
        json.ports.forEach(port => {
          port.data.forEach(analyzer => {
            if (!tempUnit && analyzer.unit) {
              tempUnit = analyzer.unit;
            }
            analyzer.data.forEach(([date, value]) => {
              if (dateMap[date] !== undefined) {
                dateMap[date] += value;
              }
            });
          });
        });

        const formattedData = Object.entries(dateMap).map(([date, value]) => ({
          name: date,
          y: value
        }));

        setChartData([{ name: "Consumption", data: formattedData }]);
        if (tempUnit) setUnit(tempUnit);
      } catch (error) {
        console.error("Error fetching daily chart data:", error);
      }
    };

    fetchChartData();
    const interval = setInterval(fetchChartData, 5000);
    return () => clearInterval(interval);
  }, [gateway_name, value_name, startDate, endDate]);

  // ✅ Move generateHourlyData here globally
  const generateHourlyData = async (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    try {
      const response = await fetch(
        `${urls.fetch_single_highchart_data}?gateway=${gateway_name}&value_name=${value_name}&from_date=${formattedDate}`
      );
      const json = await response.json();
      const hourlyMap = {};
      for (let hour = 0; hour < 24; hour++) {
        hourlyMap[`${hour}:00`] = 0;
      }
      json.ports.forEach((port) => {
        port.data.forEach((analyzer) => {
          analyzer.data.forEach(([hour, value]) => {
            hourlyMap[hour] = value;
          });
        });
      });
      const hourlyArray = Object.entries(hourlyMap).map(([time, value]) => ({
        name: time,
        y: value
      }));
      setHourlyData([{ name: "Hourly Consumption", data: hourlyArray }]);
    } catch (error) {
      console.error("Error fetching hourly data:", error);
    }
  };

  useEffect(() => {
    generateHourlyData(startDate);  // ✅ Only once on load for startDate
    const interval = setInterval(() => generateHourlyData(startDate), 5000);
    return () => clearInterval(interval);
  }, [gateway_name, value_name, startDate]);

  const handleDateClick = (clickedDate) => {
    setSelectedDay(dayjs(clickedDate)); // Set selected day
    generateHourlyData(clickedDate);    // Fetch hourly data for clicked day
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Gateway: {gateway_name} <br /> Value: {value_name}
        </Typography>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
          <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
        </div>

        <DailyChart title="Daily Consumption" data={chartData} yAxisLabel={unit} onBarClick={handleDateClick} />

        {selectedDay && (
          <HourlyChart
            title={`Hourly Consumption for ${selectedDay.format("YYYY-MM-DD")}`}
            data={hourlyData}
            yAxisLabel={unit}
          />
        )}
      </div>
    </LocalizationProvider>
  );
}

function DailyChart({ title, data, yAxisLabel, onBarClick }) {
  const chartRef = useRef(null);

  const options = {
    chart: { type: "column", backgroundColor: "transparent" }, // ✅ Remove animation: false
    title: { text: title },
    xAxis: {
      type: "category",
      title: { text: "Date" },
      labels: { rotation: -45, style: { fontSize: "12px" } },
      lineWidth: 1,
      gridLineWidth: 0
    },
    yAxis: {
      title: { text: yAxisLabel },
      gridLineWidth: 1,
      lineWidth: 1
    },
    series: data,
    credits: { enabled: false },
    plotOptions: {
      column: {
        borderWidth: 0,
        pointPadding: 0.2,
        cursor: "pointer",
        animation: { duration: 600 },  // ✅ Animate bars growing
        point: {
          events: {
            click: function () {
              onBarClick(this.name);
            }
          }
        }
      },
      series: {
        animation: { duration: 600 }  // ✅ Animate series
      }
    }
  };

  return (
    <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
  );
}


function HourlyChart({ title, data, yAxisLabel }) {
  const chartRef = useRef(null);

  const options = {
    chart: { type: "line", backgroundColor: "transparent" }, // ✅ Remove animation: false
    title: { text: title },
    xAxis: {
      type: "category",
      title: { text: "Hour" },
      labels: { rotation: -45, style: { fontSize: "12px" } },
      lineWidth: 1,
      gridLineWidth: 0
    },
    yAxis: {
      title: { text: yAxisLabel },
      gridLineWidth: 1,
      lineWidth: 1
    },
    series: data,
    credits: { enabled: false },
    plotOptions: {
      line: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 5
            }
          }
        },
        
        animation: { duration: 600 }  // ✅ Smooth line animation
      },
      series: {
        animation: { duration: 600 }  // ✅ Animate series
      }
    }
  };

  return (
    <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
  );
}


export default ProjectChart;
