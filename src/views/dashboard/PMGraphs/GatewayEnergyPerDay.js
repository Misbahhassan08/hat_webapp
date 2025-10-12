import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import { Typography, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";


// Define the API endpoints
const ENERGY_API_URL = "http://127.0.0.1:8000/Total_consumption/";
const DEPLOYED_GATEWAYS_URL = "http://127.0.0.1:8000/fetch_deployed_gateways_of_user/";

const GatewayEnergyPerDay = () => {
  const theme = useTheme();
  const location = useLocation();
  const project_id = location.state?.projectId || "";

  const [gridData, setGridData] = useState([]);
  const [solarData, setSolarData] = useState([]);
  const [gensetData, setGensetData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [gateways, setGateways] = useState([]);

  useEffect(() => {
    const fetchDeployedGateways = async () => {
      try {
        const response = await fetch(`${DEPLOYED_GATEWAYS_URL}?project_id=${project_id}`);
        const data = await response.json();

        if (response.ok) {
          const fetchedGateways = data.deployed_gateways || [];
          setGateways(fetchedGateways);
        } else {
          console.error("Failed to fetch gateways:", data.message);
        }
      } catch (err) {
        console.error("Error fetching gateways:", err);
      }
    };

    fetchDeployedGateways();

    const intervalId = setInterval(fetchDeployedGateways, 5000);
    return () => clearInterval(intervalId);
  }, [project_id]);

  useEffect(() => {
    const fetchEnergyData = async () => {
      if (gateways.length === 0) return;

      const gatewayName = gateways[0]?.gateway_name;
      if (!gatewayName) return;

      try {
        const response = await axios.get(`${ENERGY_API_URL}?gateway=${gatewayName}`);
        const data = response.data.active_power_last_24_hours;

        const groupByHour = (entries) => {
          const hourlyData = new Array(24).fill(0);
          entries.forEach((entry) => {
            const hour = new Date(entry.time).getHours();
            hourlyData[hour] += entry.value;
          });
          return hourlyData.map((v) => parseFloat(v.toFixed(2)));
        };

        setGridData(groupByHour(data.Grid || []));
        setSolarData(groupByHour(data.Solar || []));
        setGensetData(groupByHour(data.Generator || []));

        const hourLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        setCategories(hourLabels);
      } catch (error) {
        console.error("Error fetching energy data:", error);
      }
    };

    fetchEnergyData();
    const interval = setInterval(fetchEnergyData, 10000);
    return () => clearInterval(interval);
  }, [gateways]);

  const textColor = "#AFB2C1";

  const options = {
    chart: {
      type: "spline",
      backgroundColor: {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
        stops: [
          [0, "#39406D"],
          [1, "#1D2137"],
        ],
      },
      style: { fontFamily: "Arial, sans-serif" },
    },
    title: { text: "" },
    xAxis: {
      categories,
      title: { text: "Hours", style: { color: textColor } },
      labels: { style: { color: textColor } },
      lineColor: textColor,
    },
    yAxis: {
      title: { text: "kW", style: { color: textColor } },
      labels: { style: { color: textColor } },
      gridLineColor: "#444",
      gridLineDashStyle: "Dash",
    },
    tooltip: {
      shared: true,
      backgroundColor: "#2a2e4a",
      borderColor: "#444",
      style: { color: textColor },
      headerFormat: "<b>{point.key}</b><table>",
      pointFormat:
        '<tr><td style="padding:0 6px 0 0;">{series.name}:</td>' +
        '<td style="padding:0"><b>{point.y} kW</b></td></tr>',
      footerFormat: "</table>",
    },
    legend: {
      itemStyle: { color: textColor },
    },
    plotOptions: {
      spline: {
        marker: {
          enabled: false,
          states: {
            hover: { enabled: true },
          },
        },
      },
    },
    colors: ["#00C8FF", "#00FF85", "#B96AFF"],
    series: [
      { name: "Grid", data: gridData },
      { name: "Solar", data: solarData },
      { name: "Genset", data: gensetData },
    ],
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
        background: theme.palette.background.paper,
        marginBottom: 16,
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} fontSize={14} mb={1}>
        Energy Overview (Last 24 Hours)
      </Typography>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default GatewayEnergyPerDay;
