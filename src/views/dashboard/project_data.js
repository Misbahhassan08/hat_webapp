import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Card,
  CardContent,
  Link,
  IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
import { X } from "lucide-react";
import { House } from "lucide-react";
import GoogleMapReact from "google-map-react";
import urls from "../../urls/urls";
import DeployGateway from "./DeployGateway";


// 🔹 HouseMarker Component
const HouseMarker = ({ text, alertStatus, warningStatus, gatewayData }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [location, setLocation] = useState("");
  const [houseNumber, setHouseNumber] = useState("");

  let color = "green";
  if (alertStatus === "1" || alertStatus === 1) color = "red";
  else if (warningStatus === "1" || warningStatus === 1) color = "orange";

  // 🔹 Fetch address from OpenStreetMap
  useEffect(() => {
    if (gatewayData?.Lat_Log) {
      const [lat, lng] = gatewayData.Lat_Log;

      axios
        .get(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        )
        .then((res) => {
          const data = res.data;
          setLocation(data.display_name || "Location not found");

          // Extract house number if available
          const house = data.address?.house_number || data.address?.building || "";
          setHouseNumber(house);
        })
        .catch(() => {
          setLocation("Location not found");
          setHouseNumber("");
        });
    }
  }, [gatewayData]);

  return (
    <div
      style={{
        transform: "translate(-50%, -100%)",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* 🏠 House Icon */}
      <div onClick={() => setShowPopup(!showPopup)} style={{ cursor: "pointer" }}>
        <House
          size={32}
          style={{
            color: color,
            fill: color,
            stroke: "gray",
            strokeWidth: 1.5,
            filter: "drop-shadow(0px 0px 4px rgba(0,0,0,0.5))",
          }}
        />
        <div
          style={{ fontSize: "14px", fontWeight: "bold", marginTop: "4px" }}
        >
          {text}
        </div>
      </div>

      {/* 🧾 Popup Info */}
      {showPopup && (
        <Card
          sx={{
            position: "absolute",
            top: "-240px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 280,
            borderRadius: "8px",
            boxShadow: 4,
            background: "#fff",
            zIndex: 100,
          }}
        >
          <CardContent sx={{ p: 2, position: "relative" }}>
            {/* Close button */}
            <IconButton
              size="small"
              onClick={() => setShowPopup(false)}
              sx={{ position: "absolute", top: 5, right: 5 }}
            >
              <X size={16} />
            </IconButton>

            <Typography variant="h6" fontWeight={700} gutterBottom>
              {gatewayData?.gateway_name || "Gateway"}
            </Typography>

            {/* ✅ House Number */}
            <Typography variant="body2" fontWeight={600}>
              🏠 House: {gatewayData?.address || houseNumber || "Not available"}
            </Typography>

            {/* ✅ Full Location */}
            <Typography variant="body2" sx={{ mt: 1 }}>
              📍 Location: {location}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              MAC: {gatewayData?.gateway_mac}
            </Typography>

            <Typography variant="body2">
              Status:{" "}
              {alertStatus === "1" || alertStatus === 1
                ? "🚨 Alert"
                : warningStatus === "1" || warningStatus === 1
                ? "⚠️ Warning"
                : "✅ Normal"}
            </Typography>

            {/* Google Maps Link */}
            {gatewayData?.Lat_Log && (
              <Link
                href={`https://www.google.com/maps?q=${gatewayData.Lat_Log[1]},${gatewayData.Lat_Log[0]}`}
                target="_blank"
                rel="noopener"
                underline="hover"
                sx={{ display: "block", mt: 1 }}
              >
                🌍 View on Google Maps
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};


// 🔹 ProjectData Component
const ProjectData = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [connectedGateways, setConnectedGateways] = useState([]);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [gatewayData, setGatewayData] = useState(null);

  // Default map position
  const defaultProps = {
    center: {
      lat: 24.840,
      lng: 67.159
    },
    zoom: 6
  };

  // Load user info
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserId(storedUser.user_id);
      setRole(storedUser.role);
    }
  }, []);

  // 🔹 Fetch Gateway Data Every 5 Seconds
  useEffect(() => {
    let intervalId;

    const fetchGatewayData = async () => {
      try {
        const response = await axios.get(
          `https://hat-server-382170497486.us-central1.run.app/getgateway/?gateway_id=12&mac=12:04:05:30:40:53`
        );

        setGatewayData(response.data);
        console.log("Updated gateway data:", response.data);
      } catch (error) {
        console.error("Error fetching single gateway:", error);
      }
    };

    fetchGatewayData();
    intervalId = setInterval(fetchGatewayData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // 🔹 Fetch all connected gateways
  useEffect(() => {
    if (!userId && role !== "admin") return;

    const fetchGateways = async () => {
      try {
        let response;
        if (role === "admin" || role === "superadmin") {
          response = await axios.get(urls.getAllGateways);
          console.log("Gateway API Response (admin):", response.data);
        } else {
          response = await axios.get(`${urls.getUserGateways}?user_id=${userId}`);
          console.log("Gateway API Response:", response.data);
        }

        if (response.data.success) {
          setConnectedGateways(response.data.gateways || []);
        } else {
          setConnectedGateways([]);
        }
      } catch (error) {
        console.error("Error fetching gateways:", error);
        setConnectedGateways([]);
      }
    };

    fetchGateways();
  }, [userId, role]);

  // Navigate to project manager
  const handleGatewayClick = (gateway) => {
    navigate("/dashboard/project_manager", { state: { gateway } });
  };

  return (
    <Box p={2}>
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>Dashboard</Typography>
          <Typography variant="body1" fontWeight={700}>
            Welcome, {role?.toUpperCase() || "USER"}
          </Typography>
        </Box>
        <Typography variant="body1" fontWeight={700} color="text.secondary">
          Last update: {dayjs().format("YYYY-MM-DD HH:mm")}
        </Typography>
      </Box>

      {/* Connected Gateways */}
      <Box mt={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            p: "10px",
            borderRadius: "8px",
            background:
              theme.palette.mode === "dark"
                ? "#2B344A"
                : "linear-gradient(90deg, #5EACED 0%, #4089CA 100%)",
          }}
        >
          <Typography variant="h5" fontWeight={700} color="#fff">
            Connected Gateways
          </Typography>
          <TextField
            placeholder="Search"
            size="small"
            sx={{ width: "250px", background: "#fff", borderRadius: "5px" }}
          />
          {role && (role === "user" || role === "admin") && <DeployGateway />}
        </Box>

        {/* 🔹 Map (for Admin) */}
        {role === "admin" && gatewayData && (
          <div style={{ height: "500px", width: "100%", marginTop: "20px" }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: "AIzaSyAcp45sEfXq6mT19p51_LC8Goiv4ztUDnQ" }}
              center={{
                lat: parseFloat(gatewayData.Lat_Log[0]),
                lng: parseFloat(gatewayData.Lat_Log[1]),
              }}
              zoom={8}
            >
              <HouseMarker
                lat={parseFloat(gatewayData.Lat_Log[0])}
                lng={parseFloat(gatewayData.Lat_Log[1])}
                text={gatewayData.gateway_name || "My Gateway"}
                alertStatus={gatewayData.alert_status}
                warningStatus={gatewayData.warning_status}
                gatewayData={gatewayData}
              />
            </GoogleMapReact>
          </div>
        )}

        {/* 🔹 Gateway Table */}
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#E8EAF6" }}>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>MAC Address</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Deploy Status</b></TableCell>
                <TableCell><b>Config</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {connectedGateways.map((gateway, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => handleGatewayClick(gateway)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{gateway.G_id}</TableCell>
                  <TableCell>{gateway.gateway_name}</TableCell>
                  <TableCell>{gateway.mac_address}</TableCell>
                  <TableCell>{gateway.status ? "Offline" : "Online"}</TableCell>
                  <TableCell>{gateway.deploy_status}</TableCell>
                  <TableCell>{gateway.config ? "Not Configured" : "Configured"}</TableCell>
                </TableRow>
              ))}

              {connectedGateways.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No connected gateways found for this user.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ProjectData;
