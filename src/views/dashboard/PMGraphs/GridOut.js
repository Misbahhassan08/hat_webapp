import React, { useEffect, useState, useRef } from "react";
import { Typography } from "@mui/material";
import HighCharts from "../highchart";
import { useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import urls from "../../../urls/urls";
import axios from "axios";

function ProjectChart() {
  const { gateway_name, value_name } = useParams();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true); // Set to true while loading data
  const [endDate, setEndDate] = useState(dayjs());
  const [startDate, setStartDate] = useState(dayjs());
  const chartRef = useRef(null);

  // Get selectedGatewayId from localStorage
  const selectedGatewayId = localStorage.getItem('selectedGatewayId');

  useEffect(() => {
    // Fetch data only when selectedGatewayId changes
    const fetchData = async () => {
      if (!selectedGatewayId) {
        console.error("No gateway selected.");
        return;
      }

      setLoading(true); // Start loading data
      try {
        const response = await axios.get(`${urls.apiPowerData}?gateway_id=${selectedGatewayId}`);
        if (response.data.data && response.data.data.length > 0) {
          const rawData = response.data.data.slice(-10); // Get last 10 values
          const formattedData = rawData.map((item, index) => {
            const timestamp = Date.now() - (rawData.length - 1 - index) * 5000; // Simulate real-time spacing
            return [timestamp, item.setpoint2]; // Adjust field as needed
          });
          setChartData(formattedData); // Replace old data with new 10
        } else {
          setChartData([]); // Set to empty if no data available
          console.warn("No data available for the selected gateway.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setChartData([]); // Set to empty on error
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchData(); // Fetch data once when selectedGatewayId changes

  }, [selectedGatewayId]); // Only run effect when selectedGatewayId changes

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.series[0].setData(chartData, true); // Update only values
    }
  }, [chartData]); // Only re-run this effect when chartData changes

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}></div>
        {loading ? (
          <Typography>Loading power data...</Typography>
        ) : chartData.length === 0 ? (
          <Typography>No data available for the selected gateway.</Typography>
        ) : (
          <div
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid #ddd",
              padding: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              background: "white",
            }}
          >
            <HighCharts
              ref={chartRef} // Store HighCharts reference
              data={[{ name: "Grid Out", data: chartData }]}
              yAxisLabel="Power (kW)"
              type="spline"
            />
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
}

export default ProjectChart;
