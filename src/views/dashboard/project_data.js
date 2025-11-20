import React, { useEffect, useState } from "react";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, TextField, Card, CardContent, Link, IconButton
} from "@mui/material";
import { data, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTheme } from "@mui/material/styles";
import { Devices, CloudUpload, DynamicFeed, Error } from "@mui/icons-material";

import urls from "../../urls/urls";
import ProjectDataCard from "../widgets/project_data_card";
import ProjectValueCard from "../widgets/project_value_card";
import projecticon from "../../assets/images/projecticon.svg";
import ProjectChart from "./PMGraphs/ProjectChart";
import DeployGateway from "./DeployGateway";
import GoogleMapReact from "google-map-react";
import { House, X } from "lucide-react";
import { getUserIdFromLocalStorage } from "../../data/localStorage";


const HouseMarker = ({ lat, lng, text, alertStatus, warningStatus, arm, gatewayData }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [address, setAddress] = useState("");
  const [isBlinking, setIsBlinking] = useState(false);
  const [markerAddress, setMarkerAddress] = useState(""); // Separate address state per marker

  // console.log("🔔 Alert Status:", alertStatus, "Type:", typeof alertStatus);
  // console.log("⚠️ Warning Status:", warningStatus, "Type:", typeof warningStatus);
  // console.log("🏠 Gateway Data:", gatewayData);

  // Determine color and blinking based on status
  let color = "green";
  let shouldBlink = false;

  if (alertStatus === true || alertStatus === "true" || alertStatus === "1" || alertStatus === 1) {
    color = "red";
    shouldBlink = true;
    // console.log("🚨 RED ALERT - Blinking activated");
  } else if (warningStatus === true || warningStatus === "true" || warningStatus === "1" || warningStatus === 1) {
    color = "orange";
    shouldBlink = true;
    // console.log("🟠 WARNING - Blinking activated");
  }

  // console.log("🎨 Final Color:", color, "Blinking:", shouldBlink);

  // Handle blinking effect
  useEffect(() => {
    let blinkInterval;
    if (shouldBlink) {
      blinkInterval = setInterval(() => {
        setIsBlinking(prev => !prev);
      }, 1000);
    } else {
      setIsBlinking(false);
    }

    return () => {
      if (blinkInterval) clearInterval(blinkInterval);
    };
  }, [shouldBlink]);

  // Fetch address for THIS specific marker - FIXED: using individual state
  useEffect(() => {
    if (gatewayData?.latitude && gatewayData?.longitude) {
      const lat = parseFloat(gatewayData.latitude);
      const lng = parseFloat(gatewayData.longitude);
      // console.log(`🛰️ Fetching address for ${gatewayData.gateway_name}:`, lat, lng);

      axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
        .then((res) => {
          setMarkerAddress(res.data.display_name);
          // console.log(`📍 Address for ${gatewayData.gateway_name}:`, res.data.display_name);
        })
        .catch((error) => {
          console.error(`❌ Error fetching address for ${gatewayData.gateway_name}:`, error);
          setMarkerAddress("Address not found");
        });
    } else if (gatewayData?.address) {
      // Use existing address if available
      setMarkerAddress(gatewayData.address);
    }
  }, [gatewayData]);

  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -100%)',
        textAlign: 'center',
      }}
    >
      {/* Enhanced Marker Icon with Blinking */}
      <div
        onClick={() => setShowPopup(!showPopup)}
        style={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          transform: showPopup ? "scale(1.1)" : "scale(1)",
          opacity: isBlinking ? 0.3 : 1,
        }}
      >
        <House
          size={32}
          style={{
            color: color,
            fill: isBlinking ? "#ffffff" : color,
            stroke: color,
            strokeWidth: 2,
            filter: `
              drop-shadow(0px 2px 8px rgba(0,0,0,0.3))
              ${showPopup ? "brightness(1.2)" : ""}
            `,
            transition: "all 0.3s ease",
          }}
        />
        {/* Status indicator badge */}
        {(alertStatus === true || warningStatus === true) && (
          <div
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: color,
              border: "2px solid white",
              animation: shouldBlink ? "pulse 1s infinite" : "none",
            }}
          />
        )}
        <div
          style={{
            fontSize: "14px",
            fontWeight: "700",
            marginTop: "4px",
            background: "linear-gradient(135deg, #2c3e50, #34495e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 1px 2px rgba(255,255,255,0.1)"
          }}
        >
          {text}
        </div>
      </div>

      {/* Enhanced Popup with Individual Data - FIXED: using markerAddress */}
      {showPopup && (
        <Card
          sx={{
            position: "absolute",
            top: "-200px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 320,
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            zIndex: 1000,
            overflow: "hidden",
            '&:before': {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: `linear-gradient(90deg, ${color}, #3498db)`,
            }
          }}
        >
          <CardContent sx={{ p: 2.5, position: "relative" }}>
            <IconButton
              size="small"
              onClick={() => setShowPopup(false)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "rgba(0,0,0,0.05)",
                '&:hover': {
                  background: "rgba(0,0,0,0.1)",
                  transform: "rotate(90deg)"
                },
                transition: "all 0.3s ease",
                width: 28,
                height: 28
              }}
            >
              <X size={14} />
            </IconButton>

            {/* Header with Status Icon */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: color,
                  mr: 1.5,
                  animation: shouldBlink ? "pulse 1s infinite" : "none",
                }}
              />
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  background: "linear-gradient(135deg, #2c3e50, #3498db)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  flex: 1
                }}
              >
                {gatewayData?.gateway_name || "Gateway"}
              </Typography>
            </Box>

            {/* Status Alert Banner */}
            <Box
              sx={{
                background:
                  alertStatus === true
                    ? "linear-gradient(135deg, #e74c3c, #c0392b)"
                    : warningStatus === true
                      ? "linear-gradient(135deg, #f39c12, #e67e22)"
                      : "linear-gradient(135deg, #27ae60, #219a52)",
                color: "white",
                padding: "8px 12px",
                borderRadius: "8px",
                mb: 2,
                textAlign: "center",
                fontWeight: 700,
                fontSize: "14px",
                animation: shouldBlink ? "pulse 2s infinite" : "none",
              }}
            >
              {alertStatus === true
                ? "🚨 ALERT TRIGGERED"
                : warningStatus === true
                  ? "⚠️ WARNING ACTIVE"
                  : "✅ ALL SYSTEMS NORMAL"}
            </Box>

            {/* Address - FIXED: using markerAddress instead of shared address */}
            {markerAddress && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Box sx={{ mr: 1, fontSize: "16px" }}>🏠</Box>
                <Typography variant="body2" fontWeight={600} color="primary.main">
                  {markerAddress}
                </Typography>
              </Box>
            )}

            {/* Technical Details */}
            <Box sx={{
              background: "rgba(0,0,0,0.02)",
              borderRadius: "6px",
              p: 1.5,
              mt: 1.5,
              border: "1px solid rgba(0,0,0,0.05)"
            }}>
              <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                MAC: {gatewayData?.mac_address}
              </Typography>

              {/* Detailed Status Info */}
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                  Alert: {alertStatus === true ? "ACTIVE 🚨" : "INACTIVE"}
                </Typography>
                <br />
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                  Warning: {warningStatus === true ? "ACTIVE ⚠️" : "INACTIVE"}
                </Typography>
              </Box>
            </Box>

            {/* Google Maps CTA - FIXED: using correct coordinates */}
            {gatewayData?.latitude && gatewayData?.longitude && (
              <Link
                href={`https://www.google.com/maps?q=${gatewayData.latitude},${gatewayData.longitude}`}
                target="_blank"
                rel="noopener"
                underline="none"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 2,
                  p: 1,
                  background: "linear-gradient(135deg, #4285f4, #34a853)",
                  color: "white",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                  '&:hover': {
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(66, 133, 244, 0.4)",
                    background: "linear-gradient(135deg, #3367d6, #2e8b57)"
                  }
                }}
              >
                🗺️ View on Google Maps
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};




const ProjectData = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  // const adminId = location.state?.adminId; // 👈 Get the passed ID
  // console.log("Received Admin ID:", adminId);
  const locationAdminId = location.state?.adminId;
  const adminId = locationAdminId || getUserIdFromLocalStorage();

  console.log("🧠 Selected Admin ID:", locationAdminId);
  console.log("🧠 Fallback User ID (if adminId missing):", getUserIdFromLocalStorage());
  console.log("✅ Final Used ID:", adminId);
  const [connectedGateways, setConnectedGateways] = useState([]);
  console.log("final gateway with adreess ", connectedGateways);

  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [gatewayData, setGatewayData] = useState(null);
  const [lastUpdatedRowId, setLastUpdatedRowId] = useState(null);
  const [updated, setUpdated] = useState([]);
  console.log("updated time", updated);

  dayjs.extend(relativeTime);


  const defaultProps = {
    center: {
      lat: 31.5497,
      lng: 74.3436
    },
    zoom: 6
  };

  // Load user info from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserId(storedUser.user_id);
      setRole(storedUser.role);
    }
  }, []);

  // const savedGateways = getGatewaysFromLocalStorage();
  // console.log("Saved Gateways:", savedGateways);

  // last time when the gateway data update or change 

  const getUpdatedGateway = (oldData, newData) => {
    if (!oldData || !newData) return null;

    for (let newRow of newData) {
      const oldRow = oldData.find(r => r.G_id === newRow.G_id);
      if (!oldRow) continue;

      if (JSON.stringify(oldRow) !== JSON.stringify(newRow)) {
        return newRow;
      }
    }
    return null;
  };

  const globalTime = {
    minutes: 10,
  };

  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem("gateway_ids"));

    if (!savedIds || savedIds.length === 0) {
      console.log("⚠ No Gateway IDs found in localStorage");
      return;
    }

    autoPostUpdateTime(savedIds);

  }, []);



  const autoPostUpdateTime = async (gatewayIds) => {
    try {
      const minutes = globalTime.minutes;

      const payload = {
        gateway_ids: gatewayIds,
        minutes: minutes,
      };

      console.log("⏳ Auto POST Payload:", payload);

      const res = await axios.post(`${urls.checkLastUpdate}`, payload);

      console.log("🔥 Auto POST Response:", res.data);
      setUpdated(res.data.gateways);

    } catch (error) {
      console.error("❌ Auto POST Error:", error);
    }
  };




  useEffect(() => {
    if (!userId && role !== "admin") return;

    const fetchGateways = async () => {
      try {
        let response;
        let data;
        if (role === "admin" || role === "superadmin") {
          response = await axios.get(`${urls.totalGateways}?user_id=${adminId}`);
          data = response.data.Gateways;

          // SAVE FULL DATA
          localStorage.setItem("gateways", JSON.stringify(data));
          const gatewaySet = JSON.parse(localStorage.getItem("gateways"))
          console.log("Saved Gateways in LocalStorage:", gatewaySet);

          // SAVE ONLY G_id LIST
          const onlyIds = data.map((g) => g.G_id);
          localStorage.setItem("gateway_ids", JSON.stringify(onlyIds));

          console.log("💾 Saved G_ids:", onlyIds);

          console.log("new response admin", data);
        } else {
          response = await axios.get(`${urls.getUserGateways}?user_id=${userId}`);
          data = response.data.gateways
          console.log("new response user", data);
        }
        setConnectedGateways(data);
        if (role === "admin") {
          const gatewaysWithLocation = data.filter(
            (g) => g.latitude && g.longitude
          );
          setGatewayData(gatewaysWithLocation);
        }
      } catch (error) {
        console.error("❌ Error fetching gateways:", error);
        setConnectedGateways([]);
      }
    };

    fetchGateways();
    const interval = setInterval(fetchGateways, 5000);
    return () => clearInterval(interval);
  }, [userId, role]);

  const handleGatewayClick = (gateway) => {
    navigate("/dashboard/project_manager", { state: { gateway_id: gateway.G_id, gateway } });
  };

  return (
    <Box p={2}>
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
            background: theme.palette.mode === "dark"
              ? "#2B344A"
              : "linear-gradient(90deg, #5EACED 0%, #4089CA 100%)"
          }}
        >
          <Typography variant="h5" fontWeight={700} color="#fff">Connected Gateways</Typography>
          <TextField
            placeholder="Search"
            size="small"
            sx={{ width: "250px", background: "#fff", borderRadius: "5px" }}
          />
          {role && (role === "user" || role === "admin") && <DeployGateway />}
        </Box>

        {/* Map only for admin */}
        {role === "admin" && gatewayData?.length > 0 && (
          <div style={{ height: "500px", width: "100%", marginTop: "20px", position: "relative" }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: "AIzaSyAcp45sEfXq6mT19p51_LC8Goiv4ztUDnQ" }}
              defaultCenter={{
                lat: parseFloat(gatewayData[0]?.latitude),
                lng: parseFloat(gatewayData[0]?.longitude),
              }}
              defaultZoom={8}
            >
              {gatewayData.map((g) => {
                const lat = parseFloat(g.latitude);
                const lng = parseFloat(g.longitude);

                if (isNaN(lat) || isNaN(lng)) {
                  console.warn(`❌ Invalid coordinates for ${g.gateway_name}:`, g.latitude, g.longitude);
                  return null;
                }

                return (
                  <HouseMarker
                    key={g.G_id}
                    lat={lat}
                    lng={lng}
                    text={g.gateway_name}
                    alertStatus={g.alert_status}
                    warningStatus={g.warning_status}
                    arm={g.arm}
                    gatewayData={g}
                  />
                );
              })}
            </GoogleMapReact>
          </div>
        )}


        {role === "admin" && gatewayData?.length === 0 && (
          <Typography mt={2} color="error">
            No gateway with valid location found.
          </Typography>
        )}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#E8EAF6" }}>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Username</b></TableCell>
                <TableCell><b>Gateway Name</b></TableCell>
                <TableCell><b>MAC Address</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Deploy Status</b></TableCell>
                <TableCell><b>Address</b></TableCell>
                <TableCell><b>Last Updated</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {connectedGateways.map((gateway, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => handleGatewayClick(gateway)}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      gateway.alert_status
                        ? "#ffcccc" // 🔥 light red (alert)
                        : gateway.warning_status
                          ? "#ffe6b3" // ⚠️ light orange (warning)
                          : "white", // normal
                  }}
                >
                  <TableCell>{gateway.G_id}</TableCell>
                  <TableCell>{gateway.firstname || "N/A"}</TableCell>
                  <TableCell>{gateway.gateway_name}</TableCell>
                  <TableCell>{gateway.mac_address}</TableCell>
                  <TableCell>
                    {gateway.status? (
                      <span style={{ color: "green", fontWeight: 600 }}>● Online</span>
                    ) : (
                      <span style={{ color: "red", fontWeight: 600 }}>● Offline</span>
                    )}
                  </TableCell>

                  <TableCell>{gateway.deploy_status}</TableCell>
                  <TableCell>{gateway.address || "N/A"}</TableCell>
                  <TableCell>
                    {gateway.last_updated
                      ? dayjs(gateway.last_updated).fromNow()
                      : "N/A"}
                  </TableCell>
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
