import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, useTheme, Card, CardContent, Switch } from '@mui/material';
import axios from 'axios';
import Rectangle from '../../assets/images/Rectangle.svg';
import urls from '../../urls/urls';
import dayjs from 'dayjs';

const ProjectManager = () => {
  const theme = useTheme();
  const location = useLocation();
  const [gatewayData, setGatewayData] = useState(null);

  const gateway_id = location.state?.gateway_id;
  console.log("Project Manager Received Gateway ID:", gateway_id);
  const clickedGateway = location.state?.gateway || null;

  useEffect(() => {
    setGatewayData(null);
    const fetchGatewayData = async () => {
      try {
        const response = await axios.get(`${urls.getGatewayData}?gateway_id=${gateway_id}`);
        if (response.data.success) {
          setGatewayData(response.data);
          console.log("response.data", response.data);

        } else {
          console.error('Error fetching gateway:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching gateway data:', error);
      }
    };
    // const intervalId = setInterval(() => {
    fetchGatewayData();
    // }, 200)
    // return () => clearInterval(intervalId)
  }, [gateway_id]);

  if (!gatewayData) {
    return <Typography variant='h4' sx={{ color: "red", textAlign: "center" }}>No Data available.</Typography>;
  }


  const handleToggleSensor = async (sensor_id, currentState) => {
    try {
      const newState = !currentState;

      const response = await axios.post(
        `${urls.toggleSensor}${sensor_id}/`,
        { is_on: newState }
      );

      console.log("🔄 Toggle Sensor API Response:", response.data);

      // Update UI locally
      setGatewayData(prev => ({
        ...prev,
        Meta_Data: prev.Meta_Data.map(sensor =>
          sensor.id === sensor_id ? { ...sensor, is_on: newState } : sensor
        )
      }));

    } catch (error) {
      console.error("❌ Error toggling sensor:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="body1" fontWeight={700} color="text.secondary">
        Last update: {dayjs().format("YYYY-MM-DD HH:mm")}
      </Typography>
      {/* Gateway Info at Top */}
      <Box mb={3} display="flex" flexWrap="wrap" gap={2}>
        {[
          { label: 'Gateway ID', value: gatewayData.gateway_id },
          { label: 'MAC Address', value: gatewayData.gateway_mac },
          { label: 'Alert Status', value: gatewayData.alert_status },
          { label: 'Warning Status', value: gatewayData.warning_status },
        ].map((item, idx) => (
          <Card
            key={idx}
            sx={{
              flex: '1 1 200px',
              background: theme.palette.background.paper,
              minWidth: 200,
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">{item.label}</Typography>
              <Typography>
                {typeof item.value === "boolean" ? (item.value ? "True" : "False") : item.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Sensor List Title */}
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={2}
        textAlign="center"
        color={theme.palette.text.primary}
      >
        Sensor List
      </Typography>

      {/* Table Container */}
      <Box
        sx={{
          background: theme.palette.background.paper,
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          border: "1px solid #ddd",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead
            style={{
              background: theme.palette.mode === "dark" ? "#222" : "#f5f5f5",
            }}
          >
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>#</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Sensor Name</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Sensor ID</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Battery</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Active</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Preview</th>
            </tr>
          </thead>
          <tbody>
            {gatewayData.Meta_Data.map((sensor, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: "1px solid #ddd",
                  background:
                    theme.palette.mode === "dark"
                      ? index % 2 === 0
                        ? "#111"
                        : "#1a1a1a"
                      : index % 2 === 0
                        ? "#fff"
                        : "#fafafa",
                }}
              >
                <td style={{ padding: "10px" }}>{index + 1}</td>
                <td style={{ padding: "10px" }}>{sensor.Uname}</td>
                <td style={{ padding: "10px" }}>{sensor.SID}</td>
                <td
                  style={{
                    padding: "10px",
                    color: sensor.battery && parseInt(sensor.battery) < 30 ? "red" : "green",
                    fontWeight: 600,
                  }}
                >
                  {sensor.battery || "N/A"}
                </td>
                <td style={{ padding: "10px" }}>
                  <Switch
                    checked={sensor.is_on}
                    onChange={() => handleToggleSensor(sensor.id, sensor.is_on)}
                  />
                </td>

                <td style={{ padding: "10px" }}>
                  <img
                    src={sensor.image_url}
                    alt={sensor.Uname}
                    style={{
                      borderRadius: "8px",
                      width: "80px",
                      height: "auto",
                      boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                    }}
                    onError={(e) => { e.target.src = Rectangle; }}
                  />
                </td>


              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default ProjectManager;
