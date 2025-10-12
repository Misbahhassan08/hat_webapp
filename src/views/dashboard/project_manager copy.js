import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box,
  Grid,
  Modal,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  Divider,
  useMediaQuery
} from '@mui/material'
import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  WiRain,
  WiCloudy,
  WiWindy,
  WiSunset,
  WiDaySunny,
  WiSnow,
  WiDayCloudy,
  WiHumidity,
  WiStrongWind,
} from 'react-icons/wi'
import CustomNode from './customNodes'
import AnimatedSVGEdge from './animatedSVGEdge'
import { ReactFlow, useNodesState, useEdgesState } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import urls from '../../urls/urls'
import GuageMeter from './GuageMeter'
import PieChart from './PieChart'
import DummyImage from '../../assets/images/genset.png'
import { left } from '@popperjs/core'
import { ColorModeContext } from '../theme/ThemeContext'
import { Tree, TreeNode } from 'react-organizational-chart'
import ContactlessIcon from '@mui/icons-material/Contactless'
import CableIcon from '@mui/icons-material/Cable'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import DeployGateway from './DeployGateway'
import HorizontalBars from './CostBarGraph'
import CostBarGraph from './CostBarGraph'
import SolarUsage from './PMGraphs/SolarUsage'
import GridUsage from './PMGraphs/GridUsage'
import GridIn from './PMGraphs/GridIn'
import GridOut from './PMGraphs/GridOut'
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';




const nodeTypes = {
  customNode: CustomNode,
}
const initialNodes = [
  {
    id: 'solar',
    position: { x: -100, y: -200 },
    data: {
      label: "0.00",
      subLabel: '0.00',
      iconType: 'solar',
      style: {
        width: 80,
        height: 80,
        borderRadius: '50%',
      },
      outgoingHandlePosition: 'bottom',
      incomingHandlePosition: 'bottom',
    },
    type: 'customNode',
    draggable: false,
  },
  {
    id: 'genset',
    position: { x: -100, y: 50 },
    data: {
      label: "0.00",
      subLabel: '0.00',
      iconType: 'genset',
      style: {
        width: 80,
        height: 80,
        borderRadius: '50%',
      },
      outgoingHandlePosition: 'top',
      incomingHandlePosition: 'top',
    },
    type: 'customNode',
    draggable: false,
  },
  {
    id: 'load',
    position: { x: 110, y: -70 },
    data: {
      label: '0.00',
      subLabel: "0.00",
      iconType: 'load',
      style: {
        width: 80,
        height: 80,
        borderRadius: '50%',
      },
      outgoingHandlePosition: 'left',
      incomingHandlePosition: 'left',
    },
    type: 'customNode',
    draggable: false,
  },
  {
    id: 'grid',
    position: { x: -300, y: -70 },
    data: {
      label: "0.00",
      subLabel: '0.00',
      iconType: 'grid',
      style: {
        width: 80,
        height: 80,
        borderRadius: '50%',
      },
      outgoingHandlePosition: 'right',
      incomingHandlePosition: 'right',
    },
    type: 'customNode',
    draggable: false,
  },
]

// Edge types
const edgeTypes = {
  animatedSvg: AnimatedSVGEdge,
}
const initialEdges = [
  { id: 'solar->load', type: 'bezier', source: 'solar', target: 'load' },
  { id: 'grid->load', type: 'bezier', source: 'grid', target: 'load' },
  { id: 'genset->load', type: 'bezier', source: 'genset', target: 'load' },
  { id: 'solar->grid', type: 'bezier', source: 'solar', target: 'grid' },
  { id: 'grid->genset', type: 'bezier', source: 'grid', target: 'genset' },
  { id: '4->2', type: 'bezier', source: '4', target: '2' },
]

const ProjectManager = () => {
  const theme = useTheme()

  const location = useLocation()
  const navigate = useNavigate()
  const projectName = location.state?.projectName || 'Unknown Project'
  const latitude = location.state.latitude || ''
  const longitude = location.state.longitude || ''
  const address = location.state.address || ''
  const project_id = location.state?.projectId || ''
  const [gateway, setGateway] = useState('')
  const [dropdownGateways, setDropdownGateways] = useState([])
  const [weatherData, setWeatherData] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [gateways, setGateways] = useState([])
  const [error, setError] = useState('')
  const [metadataData, setMetadataData] = useState({})
  const [selectedAnalyzer, setSelectedAnalyzer] = useState(null)
  const handleOpen = () => setModalOpen(true)
  const handleClose = () => setModalOpen(false)
  const [nodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, onEdgesChange] = useEdgesState(initialEdges)
  const [newNodes, setNewNodes] = useState(initialNodes)
  const [newEdges, setNewEdges] = useState(initialEdges)
  const [role, setRole] = useState('');
  const [expandedAnalyzers, setExpandedAnalyzers] = useState({});
  const [expandedGateways, setExpandedGateways] = useState({});

  const toggleGatewayExpansion = (gatewayName) => {
    setExpandedGateways((prev) => {
      const isExpanding = !prev[gatewayName];

      if (isExpanding) {
        const selectedGatewayData = gateways.find(gw => gw.gateway_name === gatewayName);
        const gatewayId = selectedGatewayData ? selectedGatewayData.G_id : null;

        if (gatewayId) {
          localStorage.setItem("selectedGatewayId", gatewayId);
        }

        // Save selected gateway name per project
        let storedGateways = JSON.parse(localStorage.getItem("selectedGateways")) || {};
        storedGateways[project_id] = gatewayName;
        localStorage.setItem("selectedGateways", JSON.stringify(storedGateways));

        // Update the local state
        setSelectedGatewayForDropdown(gatewayName);
      }

      return {
        ...prev,
        [gatewayName]: isExpanding,
      };
    });
  };
  // useEffect(() => {
  //   const storedGateways = JSON.parse(localStorage.getItem("selectedGateways")) || {};
  //   const defaultGateway = storedGateways[project_id];

  //   if (defaultGateway) {
  //     setExpandedGateways(prev => ({
  //       ...prev,
  //       [defaultGateway]: true,
  //     }));
  //   }
  // }, [gateways]); // or after fetching dropdownGateways
  const toggleAnalyzer = (key) => {
    setExpandedAnalyzers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };


  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setRole(user.role || ''); // Set role from localStorage
    }
  }, []);
  // console.log('dropdowm:', selectedGatewayForDropDown)

  // dynamically updated the animation
  const updateEdgesBasedOnOutput = (analyzers) => {
    const activeNodes = analyzers
      .filter((analyzer) => {
        const lastValue = parseFloat(analyzer.values[analyzer.values.length - 1]?.value || '0.00')
        return lastValue > 0
      })
      .map((analyzer) => analyzer.type.toLowerCase())

    const updatedEdges = initialEdges.map((edge) => {
      const isActive = activeNodes.includes(edge.source)
      return {
        ...edge,
        type: isActive && edge.target === 'load' ? 'animatedSvg' : 'bezier',
      }
    })

    return updatedEdges
  }

  

  const handleGatewayChange = (event) => {
    const selectedGateway = event.target.value; // Get selected gateway name or ID
    setSelectedGatewayForDropdown(selectedGateway);

    // Fetch Gateway ID (Assuming you can get the G_id from the selected gateway object)
    const selectedGatewayData = gateways.find(gw => gw.gateway_name === selectedGateway);
    const gatewayId = selectedGatewayData ? selectedGatewayData.G_id : null;

    // Save the Gateway ID (G_id) to localStorage under a separate record
    if (gatewayId) {
      localStorage.setItem("selectedGatewayId", gatewayId);
    }

    // Store selected gateway for the project (you already have this logic)
    let storedGateways = JSON.parse(localStorage.getItem("selectedGateways")) || {};
    storedGateways[project_id] = selectedGateway;
    localStorage.setItem("selectedGateways", JSON.stringify(storedGateways));
  };



  const [selectedGatewayForDropDown, setSelectedGatewayForDropdown] = useState(() => {
    const storedGateways = JSON.parse(localStorage.getItem("selectedGateways")) || {};
    return storedGateways[project_id] || ""; // Get the correct gateway for the project
  });

  const backgroundStyle =
  theme.palette.mode === 'light'
    ? `linear-gradient(to right, rgba(201, 202, 203, 0.91), rgba(209, 207, 207, 0.3)), url('https://i0.wp.com/calmatters.org/wp-content/uploads/2021/11/clean-energy-power-grid.jpg?fit=1836%2C1059&ssl=1') center/cover no-repeat`
    : `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(25, 25, 25, 0.6)), url('https://i0.wp.com/calmatters.org/wp-content/uploads/2021/11/clean-energy-power-grid.jpg?fit=1836%2C1059&ssl=1') center/cover no-repeat`;



  /////// fetchDeployedGatewaysForDropdown //////
  useEffect(() => {
    const fetchDeployedGatewaysForDropdown = async () => {
      try {
        const response = await axios.get(`${urls.getGatewaysForDropdown}?project_id=${project_id}`);
        const data = response.data.deployed_gateways;
        setDropdownGateways(data);

        // Retrieve stored gateways from localStorage
        let storedGateways = JSON.parse(localStorage.getItem("selectedGateways")) || {};

        // Get the selected gateway for the current project
        const storedGateway = storedGateways[project_id];

        // Ensure the stored gateway exists in the current project
        if (storedGateway && data.some((gw) => gw.gateway_name === storedGateway)) {
          setSelectedGatewayForDropdown(storedGateway);
        } else {
          setSelectedGatewayForDropdown(""); // Reset if no valid stored gateway
        }
      } catch (error) {
        console.error("Error fetching gateways for dropdown", error);
      }
    };

    fetchDeployedGatewaysForDropdown();
    const intervalId = setInterval(fetchDeployedGatewaysForDropdown, 5000);
    return () => clearInterval(intervalId);
  }, [project_id]);


  ///// fetchdeployedgateways /////
  useEffect(() => {
    const fetchDeployedGateways = async () => {
      try {
        const response = await fetch(`${urls.fetchDeployedGateways}?project_id=${project_id}`)
        const data = await response.json()
        console.log('Fetched Deployed Gateways:', data)

        if (response.ok) {
          const fetchedGateways = data.deployed_gateways || []
          console.log('fetched deployed gateways:', fetchedGateways)
          setGateways(fetchedGateways)
        } else {
          setError(data.message || 'Failed to fetch gateways')
        }
      } catch (err) {
        setError('Error occurred while fetching data')
        console.error(err)
      }
    }

    fetchDeployedGateways()

    const intervalId = setInterval(fetchDeployedGateways, 5000)
    return () => clearInterval(intervalId)

  }, [project_id])


  ////// fetchweatherdata //////
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!latitude || !longitude) {
        console.warn('Latitude and Longitude not available')
        // Just set default dummy weather data instead of skipping everything
        setWeatherData({
          currentConditions: { temp: 0 },
          days: [{ hours: Array.from({ length: 24 }, () => ({ temp: 0 })) }]
        })
        return
      }

      try {
        const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?key=CGYB7C92LET4UR7F9YY2TWYLS`

        const response = await fetch(apiUrl)
        const data = await response.json()
        console.log('weather', data)

        // Convert Fahrenheit to Celsius
        data.currentConditions.temp = ((data.currentConditions.temp - 32) * 5) / 9
        data.days[0].hours.forEach((hour) => {
          hour.temp = ((hour.temp - 32) * 5) / 9
        })

        setWeatherData(data)
      } catch (error) {
        console.error('Error fetching weather data:', error)
        // If fetch fails, fallback to 0 temp
        setWeatherData({
          currentConditions: { temp: 0 },
          days: [{ hours: Array.from({ length: 24 }, () => ({ temp: 0 })) }]
        })
      }
    }

    fetchWeatherData()
  }, [latitude, longitude])



  /////// fetchDeployedGatewaysForDropdown //////
  useEffect(() => {
    const fetchDeployedGatewaysForDropdown = async () => {
      try {
        const response = await axios.get(`${urls.getGatewaysForDropdown}?project_id=${project_id}`)
        const data = response.data.deployed_gateways
        setDropdownGateways(data)
      } catch (error) {
        console.error('Error fetching gateways for dropdown', error)
      }
    }

    fetchDeployedGatewaysForDropdown()
    const intervalId = setInterval(fetchDeployedGatewaysForDropdown, 5000)
    return () => clearInterval(intervalId)
  }, [project_id])

  // ✅ Fetch metadata when gateways change
  useEffect(() => {
    const fetchMetadataForGateways = async () => {
      const metadataResults = {}

      for (const gateway of gateways) {
        const gatewayName = gateway.gateway_name

        try {
          const response = await axios.get(urls.fetch_Metadata(gatewayName))
          metadataResults[gatewayName] = response.data
          console.log('Meta Data:', response.data)
        } catch (error) {
          console.error(`Error fetching metadata for gateway ${gatewayName}:`, error)
        }
      }

      setMetadataData(metadataResults) // ✅ Update state
    }

    if (gateways.length > 0) {
      fetchMetadataForGateways() // ✅ Fetch metadata when gateways exist
    }
  }, [gateways])

  ///// FetchAnalyzerData /////
  useEffect(() => {
    const fetchAnalyzerData = async () => {
      if (selectedGatewayForDropDown) {
        try {
          const response = await axios.get(
            urls.getAnalyzerValuesByGateway(selectedGatewayForDropDown),
          )
          const analyzers = response.data.analyzers || []

          // Update nodes
          const updatedNodes = newNodes.map((node) => {
            const analyzer = analyzers.find((a) => a.type.toLowerCase() === node.id.toLowerCase())

            if (analyzer) {
              const lastValue = parseFloat(
                analyzer.values[analyzer.values.length - 1]?.value || '0.00',
              )

              return {
                ...node,
                data: {
                  ...node.data,
                  label: node.id === 'load' ? lastValue : node.data.label,
                  subLabel: node.id !== 'load' ? lastValue : node.data.subLabel,
                },
              }
            }
            return node
          })

          setNewNodes(updatedNodes)

          // Update edges
          const updatedEdges = updateEdgesBasedOnOutput(analyzers)
          setNewEdges(updatedEdges)
        } catch (error) {
          console.error('Error fetching analyzer data:', error)
        }
      }
    }

    fetchAnalyzerData()

    const intervalId = setInterval(fetchAnalyzerData, 6700)

    return () => clearInterval(intervalId)
  }, [selectedGatewayForDropDown])

  const getNextHours = (hours) => {
    if (!hours || !Array.isArray(hours)) return []

    const currentHour = new Date().getHours()

    return hours
      .filter((hour) => {
        // Make sure hour.datetime exists and is a string
        if (!hour.datetime || typeof hour.datetime !== 'string') return false

        const hourValue = parseInt(hour.datetime.split(':')[0])
        return hourValue >= currentHour
      })
      .slice(0, 5)
  }


  const getWeatherIcon = (temp, conditions) => {
    if (!temp || !conditions) return null; // ✅ Handle missing values

    if (conditions.toLowerCase().includes("rain"))
      return <WiRain color="#0077b6" size={80} />; // Deep Blue for Rain

    if (conditions.toLowerCase().includes("cloud"))
      return <WiCloudy color="#6c757d" size={80} />; // Neutral Gray for Clouds

    if (conditions.toLowerCase().includes("wind"))
      return <WiWindy color="#00a8cc" size={80} />; // Fresh Sky Blue for Wind

    if (conditions.toLowerCase().includes("sunrise") || conditions.toLowerCase().includes("sunset"))
      return <WiSunset color="#ff914d" size={80} />; // Warm Sunset Orange

    if (temp >= 30)
      return <WiDaySunny color="#f4a261" size={80} />; // Soft Sun Orange

    if (temp < 15)
      return <WiSnow color="#6dd5ed" size={80} />; // Cool Icy Blue for Cold Weather

    return <WiDayCloudy color="#f5c518" size={80} />; // Soft Yellow for Mild Conditions
  };

  if (!weatherData || !weatherData.currentConditions) {
    return <Typography variant="h6">Loading Weather Data...</Typography> // ✅ Prevent error
  }

  // navigation to project chart page

  const navigateToChart = (valueName, gatewayName, address, value) => {
    navigate(`/dashboard/projectchart/${gatewayName}/${valueName}`, {
      state: { address, value }, // ✅ Pass additional data to the next screen
    })
  }

  const getIconAndBgColor = (purpose) => {
    if (purpose === "Gateway") {
      return {
        icon: null,
        bgColor: "", // Deep Blue & Modern Green
        mainBoxBg: theme.palette.background.gatewaycard
      };
    } else if (["COM1", "COM2", "ETH1", "ETH2"].includes(purpose)) {
      return {
        icon: <CableIcon fontSize="large" />,
        bgColor: "linear-gradient(135deg, #D32F2F, #B71C1C)", // Bold Red for Connections
        mainBoxBg: theme.palette.background.card
      };
    } else if (purpose === "Analyzer") {
      return {
        icon: null,
        bgColor: "", // Professional Teal & Deep Green
        mainBoxBg: theme.palette.background.gatewaycard
      };
    } else {
      return {
        icon: <ContactlessIcon fontSize="large" />,
        bgColor: "linear-gradient(135deg, #E8489E, #E62E8E, #D32999, #A31DB3, #9F1CB5, #8723C1)", // Elegant Dark Gray
        mainBoxBg: theme.palette.background.card
      };
    }
  };
  const TreeBox = ({ label, purpose, onClick, sticker }) => {
    const { icon, bgColor, mainBoxBg } = getIconAndBgColor(purpose);

    return (
      <Box
        sx={{
          p: '10px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1), 0 6px 12px rgba(0,0,0,0.08)',

          background: mainBoxBg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minWidth: '150px',
          maxWidth: '100%',
          cursor: onClick ? 'pointer' : 'default',
          position: 'relative',
          overflow: 'visible',
        }}
        onClick={onClick}
      >
        {/* 🔴 Top-Right Sticker */}
        {sticker && (
          <Box
            sx={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              background: "linear-gradient(135deg, #E8489E, #E62E8E, #D32999, #A31DB3, #9F1CB5, #8723C1)",
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px',
              px: 1.5,
              py: 0.5,
              borderRadius: '6px',
              zIndex: 2,
            }}
          >
            {sticker}
          </Box>
        )}

        {/* ✅ Icon Box (aligned top-left) */}
        {icon && (
          <Box
            sx={{
              width: '50px',
              height: '50px',
              background: bgColor,
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: '-12px',
              left: '10px', // aligned to the left
            }}
          >
            {React.cloneElement(icon, { style: { color: 'white' } })}
          </Box>
        )}

        {/* ✅ Label */}
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            marginTop: icon ? '40px' : '0px',
            textAlign: 'center',
            width: '100%',
          }}
        >
          {label}
        </Typography>
      </Box>
    );
  };





  return (

    <Box sx={{ p: 2, }}>
      {/* Responsive Grid Layout */}
      <Grid container spacing={0}>
        <Grid container spacing={1} alignItems="stretch" mt={1} >





          {/* ✅ Weather Information (Right Side) */}
          <Grid item xs={12} onClick={handleOpen} style={{ cursor: "pointer" }}>
            <motion.div
              whileHover={{ scale: 1.03, boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)" }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  background:backgroundStyle,
                   p: "20px",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                  border: "1px solid #ddd",
                  textAlign: "center",
                  maxHeight: "400px", // Increased height
                  minHeight: "230px", // Increased height
                  position: "relative", // Allow positioning of children
                }}
              >
                {/* Top-right weather section */}
                <Box sx={{ position: "absolute", top: 20, right: 20 }}>
                  {/* ✅ Temperature with Animation */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Box
                      sx={{
                        fontSize: "32px",
                        fontWeight: "bold",
                        display: "inline-block",
                        color: theme.palette.text.primary,
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {weatherData?.currentConditions?.conditions}
                      </Typography>
                      {weatherData?.currentConditions?.temp.toFixed(1)}°C
                    </Box>
                  </motion.div>

                  {/* ✅ Weather Icon with Animation */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Box sx={{ fontSize: "0px" }}>
                      {getWeatherIcon(
                        weatherData?.currentConditions?.temp,
                        weatherData?.currentConditions?.conditions
                      )}
                    </Box>
                  </motion.div>

                  {/* ✅ Humidity and Wind Speed */}
                  <Grid container sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <WiHumidity size={40} color="blue" />
                          <Typography variant="body2">
                            {weatherData?.currentConditions?.humidity}%
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>

                    <Grid item xs={6}>
                      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <WiStrongWind size={40} color="gray" />
                          <Typography variant="body2">
                            {weatherData?.currentConditions?.windspeed} km/h
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                  </Grid>
                </Box>

                {/* ✅ Current Condition */}
                <Box sx={{ position: "relative" }}>
                  <Box sx={{ position: "absolute", top: 20, left: 20, textAlign: "left" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      👋 Welcome Back
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        mt: 0.5,
                        fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                      }}
                    >
                      {projectName}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>
          {/* ✅ MODAL for Detailed Weather Info */}
          <Modal open={modalOpen} onClose={handleClose}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: '70%', md: '70%' }, // Larger width
                background: theme.palette.background.paper,
                borderRadius: '10px',
                boxShadow: 24,
                p: 4,
                maxHeight: '90vh',
                overflowY: 'auto',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom style={{ marginBottom: '20px' }}>
                Weather Details
              </Typography>

              {/* ✅ Current Conditions */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <b> 🌡 Temperature: </b>{weatherData.currentConditions.temp.toFixed(1)}°C
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <b>🌥 Conditions:</b>  {weatherData.currentConditions.conditions}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <b>💧 Humidity: </b> {weatherData.currentConditions.humidity}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <b>💨 Wind Speed:</b>   {weatherData.currentConditions.windspeed} km/h
                  </Typography>
                </Grid>
              </Grid>

              {/* ✅ Weather Icon for Current Conditions */}
              <Box sx={{ mt: 2 }}>
                {weatherData.currentConditions.conditions === 'Clear' && (
                  <WiDaySunny size={50} color="orange" />
                )}
                {weatherData.currentConditions.conditions === 'Rain' && (
                  <WiRain size={50} color="blue" />
                )}
                {weatherData.currentConditions.conditions === 'Cloudy' && (
                  <WiCloudy size={50} color="gray" />
                )}
                {weatherData.currentConditions.conditions === 'Windy' && (
                  <WiStrongWind size={50} color="gray" />
                )}
              </Box>

              {/* ✅ Next 7 Days Forecast */}
              <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: "bold" }}>
                7-Day Forecast
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                {weatherData.days.slice(1, 8).map((day, index, array) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    style={{ textAlign: "center", padding: "0 10px", position: "relative" }}
                  >
                    {/* ✅ Weather Icon Animation */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {getWeatherIcon(day.temp, day.conditions)}
                    </motion.div>

                    {/* ✅ Date and Temperature */}
                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                      {new Date(day.datetime).toLocaleDateString("en-US", { weekday: "short" })}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: "gray" }}>
                      {day.datetime}
                    </Typography>
                    <Typography sx={{ fontSize: "14px" }}>
                      {((day.tempmax - 32) * 5 / 9).toFixed(1)}° / {((day.tempmin - 32) * 5 / 9).toFixed(1)}°C
                    </Typography>

                    {/* Vertical Divider (Except Last Item) */}
                    {index !== array.length - 1 && (
                      <Box
                        sx={{
                          width: "2px",
                          height: "50px",
                          backgroundColor: "#ddd",
                          position: "absolute",
                          right: "-10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </Box>


              {/* ✅ Close Button */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button variant="contained" color="primary" onClick={handleClose}>
                  Close
                </Button>
              </Box>
            </Box>
          </Modal>








          {/* Wlcm to user */}
          <Grid item xs={12}>
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: theme.palette.background.paper,
      py: { xs: '10px', md: '20px' },
      px: { xs: '5px', md: '10px' },
      borderRadius: '10px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      border: '1px solid #ddd',
      flexWrap: 'wrap',
      gap: { xs: '10px', md: '20px' },
    }}
  >
    {/* Right Side: Gateways List */}
    <Box sx={{ flex: 1, minWidth: '300px' }}>
      <InputLabel sx={{ 
        color: 'grey', 
        fontWeight: 'bold', 
        mb: 1,
        fontSize: { xs: '0.9rem', sm: '1rem' }
      }}>
        Gateways
      </InputLabel>

      <Box sx={{ width: '100%' }}>
        {role === 'user' && <DeployGateway />}
      </Box>
      
      <Box sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
        {dropdownGateways.length > 0 ? (
          dropdownGateways.map((gw) => (
            <Box key={gw.mac_address} sx={{ mb: 1 }}>
              {/* Gateway Header */}
              <Box
                sx={{
                  background: theme.palette.background.default,
                  borderRadius: '8px',
                  px: { xs: '8px', md: '12px' },
                  py: { xs: '4px', md: '6px' },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="600" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                    {gw.gateway_name}
                  </Typography>

                  <IconButton size="small" onClick={() => toggleGatewayExpansion(gw.gateway_name)}>
                    {expandedGateways[gw.gateway_name] ? 
                      <ExpandLess fontSize="small" /> : 
                      <ExpandMore fontSize="small" />}
                  </IconButton>
                </Box>

                {/* Expanded Content */}
                {expandedGateways[gw.gateway_name] && (
                  <Box sx={{ mt: 1, width: '100%' }}>
                    {/* Gateway Details */}
                    <TreeBox
                      purpose="Gateway"
                      label={
                        <>
                          Gateway: {gw.gateway_name} <br />
                          Mac Address: {gw.mac_address}
                        </>
                      }
                    />

                            {/* Ports and Analyzers */}
                            {metadataData[gw.gateway_name] ? (
                              <Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'flex-start',
    mt: 2,
    gap: '2px',
    overflowX: 'auto',
    width: '100%',
    '&::-webkit-scrollbar': {
      height: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#888',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f0f0f0',
    },
  }}
>


                                {metadataData[gw.gateway_name].ports.map((port, portIndex) => (
                                  <Box
                                  key={portIndex}
                                  sx={{
                                    minWidth: { xs: '100%', sm: '280px' },
                                    background: theme.palette.background.default,
                                    borderRadius: '12px',
                                    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                                    p: 2,
                                    m: { xs: '4px 0', sm: 1 },
                                    position: 'relative',
                                  }}
                                >
                                  {/* Port Name Sticker */}
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: '-8px',
                                      
                                      right: { xs: '0px', sm: '-10px' },
                                      background: `linear-gradient(135deg,#E8489E 0%,#E62E8E 20%,#D32999 40%, #A31DB3 60%,#9F1CB5 80%, #8723C1 100%)`,
                                      color: 'white',
                                      fontWeight: 'bold',
                                      fontSize: { xs: '10px', sm: '12px' },
                                      px: 1.5,
                                      py: 0.5,
                                      borderRadius: '6px',
                                    }}
                                  >
                                    {port.port_name}
                                  </Box>




                                    {/* ✅ Analyzer Boxes under this Port */}



                                    {port.analyzers.map((analyzer, analyzerIndex) => {
                                      const analyzerKey = `${gw.gateway_name}-${port.port_name}-${analyzer.name}`;
                                      const isExpanded = expandedAnalyzers[analyzerKey] || false;

                                      return (
                                        <Box key={analyzerIndex} sx={{ mt: 2, width: '100%' }}>
                                  <TreeBox
                                    purpose="Analyzer"
                                    label={
                                      <Box sx={{ width: '100%' }}>
                                        {/* Top Row */}
                                        <Box sx={{ 
                                          display: 'flex', 
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          gap: 1
                                        }}>
                                          <Typography 
                                            variant="subtitle1" 
                                            fontWeight="bold"
                                            sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                                          >
                                            {analyzer.name}
                                          </Typography>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box
                                              sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                backgroundColor: analyzer.status ? 'green' : 'red',
                                              }}
                                            />
                                            <IconButton size="small" sx={{ p: 0 }}>
                                              {isExpanded ? 
                                                <ExpandLess fontSize="small" /> : 
                                                <ExpandMore fontSize="small" />}
                                            </IconButton>
                                          </Box>
                                        </Box>

                                                {/* Bottom Row: First 2 values + Type Icon */}
                                                <Box sx={{ 
                                          display: 'flex', 
                                          justifyContent: 'space-between', 
                                          alignItems: 'center', 
                                          mt: 1, 
                                          gap: 1 
                                        }}>                                                   {/* Value Fields */}
                                          {analyzer.values.slice(0, 2).map((val, idx) => (
                                            <Box 
                                              key={idx} 
                                              sx={{ 
                                                flex: 1,
                                                textAlign: 'left',
                                                overflow: 'hidden'
                                              }}
                                            >
                                              <Typography 
                                                variant="body2" 
                                                fontWeight="600"
                                                sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                                              >
                                                {val.name}
                                              </Typography>
                                              <Typography 
                                                variant="body2"
                                                sx={{ 
                                                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                                  whiteSpace: 'nowrap',
                                                  textOverflow: 'ellipsis',
                                                  overflow: 'hidden'
                                                }}
                                              >
                                                {val.value}
                                              </Typography>
                                            </Box>
                                          ))}
                                                  {/* Analyzer Type Icon */}
                                                  <Box>
                                                    {analyzer.type === 'grid' && (
                                                      <img src="https://mexemai.com/bucket/ems/image/gridcolor.png" alt="Grid Icon" style={{ height: 22 }} />
                                                    )}
                                                    {analyzer.type === 'Power' && (
                                                      <img src="https://mexemai.com/bucket/ems/image/Untitled-5.png" alt="Power Icon" style={{ height: 22 }} />
                                                    )}
                                                    {analyzer.type === 'solar' && (
                                                      <img src="https://mexemai.com/bucket/ems/image/solarcolored.png" alt="Genset Icon" style={{ height: 22 }} />
                                                    )}
                                                    {analyzer.type === 'generator' && (
                                                      <img src="https://mexemai.com/bucket/ems/image/generator.png" alt="Load Icon" style={{ height: 22 }} />
                                                    )}
                                                  </Box>


                                                </Box>
                                                <hr style={{ width: '100%', marginBottom: '0.5rem' }} />

                                                {isExpanded && (
                                                  <Box
                                                  sx={{
                                                    p: 1,
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    flexWrap: 'wrap',
                                                    gap: '8px',
                                                    mt: 1,
                                                  }}
                                                >


                                                    {analyzer.values.map((val, valIndex) => (
                                                       <Box
                                                       key={valIndex}
                                                       sx={{
                                                         flex: '1 1 45%',
                                                         minWidth: '120px',
                                                         p: '5px',
                                                         backgroundColor: theme.palette.background.default,
                                                         borderRadius: '5px',
                                                         cursor: 'pointer',
                                                         '&:hover': {
                                                           transform: 'translateY(-2px)',
                                                           boxShadow: 2
                                                         }
                                                       }}
                                                       onClick={() => navigateToChart(val.name, gw.gateway_name)}
                                                     >
                                                        <Grid display="flex" flexDirection="row" columnGap={1}>
                                                          <Typography variant="subtitle2" display="flex" flexDirection="column">
                                                            <Box><b>Name</b></Box>
                                                            <Box>{val.name}</Box>
                                                          </Typography>
                                                          <Divider orientation="vertical" flexItem />
                                                          <Typography variant="subtitle2" display="flex" flexDirection="column">
                                                            <Box><b>Value</b></Box>
                                                            <Box>{val.value}</Box>
                                                          </Typography>
                                                          <Divider orientation="vertical" flexItem />
                                                          <Typography variant="subtitle2" display="flex" flexDirection="column">
                                                            <Box><b>Address</b></Box>
                                                            <Box>{val.address}</Box>
                                                          </Typography>
                                                        </Grid>
                                                      </Box>
                                                    ))}
                                                  </Box>
                                                )}
                                              </Box>
                                            }
                                            onClick={() => toggleAnalyzer(analyzerKey)}
                                            sx={{
                                              cursor: 'pointer',
                                              '&:hover': {
                                                backgroundColor: theme.palette.action.hover
                                              }
                                            }}

                                          />







                                        </Box>
                                      );
                                    })}




                                  </Box>
                                ))}

                              </Box>
                            ) : (
                              <TreeBox label="No metadata available." />
                            )}

                            <Grid container spacing={2} mt={2}>
                              {/* ✅ First Box - Only Solar Cost Bar Charts */}
                              <Grid item xs={12} md={6} height={450}>
                                {expandedGateways && (
                                  <Box
                                    sx={{
                                      background: theme.palette.background.paper,
                                      p: { xs: 2, sm: 3 },
                                      borderRadius: '10px',
                                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                      border: '1px solid #ddd',
                                      textAlign: 'center',
                                      height: '100%',
                                    }}
                                  >
                                    <Grid
                                      container
                                      justifyContent="center"
                                      alignItems="center"
                                    >
                                      <Grid item xs={12}>
                                        <CostBarGraph />
                                      </Grid>
                                    </Grid>
                                  </Box>
                                )}
                              </Grid>


                              {/* ✅ Second Box - ReactFlow (UNCHANGED) */}
                              <Grid item xs={12} md={6} height={450}>
                                {expandedGateways && (
                                  <Box
                                    sx={{
                                      background: theme.palette.background.paper,
                                      p: '20px',
                                      borderRadius: '10px',
                                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                      border: '1px solid #ddd',
                                      textAlign: 'center',
                                      height: '100%',
                                    }}
                                  >
                                    <ReactFlow
                                      nodes={newNodes}
                                      edges={newEdges}
                                      onNodesChange={onNodesChange}
                                      onEdgesChange={onEdgesChange}
                                      nodeTypes={nodeTypes}
                                      edgeTypes={edgeTypes}
                                      fitView={true}
                                      zoomOnScroll={true}
                                      panOnScroll={false}
                                      panOnDrag={false}
                                      nodesDraggable={false}
                                      proOptions={{ hideAttribution: true }}
                                    />
                                  </Box>
                                )}
                              </Grid>
                            </Grid>
                            <Grid container spacing={2} mt={1}>
                              {/* First grpagh Solar USage */}
                              <Grid item xs={12} md={6}>
                                {expandedGateways && (
                                  <>
                                    {/* Card only for heading */}
                                    <Box
                                      sx={{
                                        background: theme.palette.background.paper,
                                        p: '20px',
                                        borderRadius: '10px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        border: '1px solid #ddd',
                                        textAlign: 'center',
                                      }}
                                    >
                                      <Typography textAlign="center" fontWeight="bold">
                                        Solar Production
                                      </Typography>
                                      <Box mt={2}>
                                        <SolarUsage />
                                      </Box>
                                    </Box>

                                    {/* Graph rendered outside the card */}

                                  </>
                                )}
                              </Grid>
                              {/* First grpagh Grid USage */}
                              <Grid item xs={12} md={6}>
                                {expandedGateways && (
                                  <>
                                    {/* Card only for heading */}
                                    <Box
                                      sx={{
                                        background: theme.palette.background.paper,
                                        p: '20px',
                                        borderRadius: '10px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        border: '1px solid #ddd',
                                        textAlign: 'center',
                                      }}
                                    >
                                      <Typography textAlign="center" fontWeight="bold">
                                        Load Consumed
                                      </Typography>
                                      <Box mt={2}>
                                        <GridUsage />
                                      </Box>
                                    </Box>

                                    {/* Graph rendered outside the card */}

                                  </>
                                )}
                              </Grid>
                              {/* First grpagh Grid In */}
                              <Grid item xs={12} md={6}>
                                {expandedGateways && (
                                  <>
                                    {/* Card only for heading */}
                                    <Box
                                      sx={{
                                        background: theme.palette.background.paper,
                                        p: '20px',
                                        borderRadius: '10px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        border: '1px solid #ddd',
                                        textAlign: 'center',
                                      }}
                                    >
                                      <Typography textAlign="center" fontWeight="bold">
                                        Grid In
                                      </Typography>
                                      <Box mt={2}>
                                        <GridIn />
                                      </Box>
                                    </Box>

                                    {/* Graph rendered outside the card */}

                                  </>
                                )}
                              </Grid>
                              {/* First grpagh Grid out */}
                              <Grid item xs={12} md={6}>
                                {expandedGateways && (
                                  <>
                                    {/* Card only for heading */}
                                    <Box
                                      sx={{
                                        background: theme.palette.background.paper,
                                        p: '20px',
                                        borderRadius: '10px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        border: '1px solid #ddd',
                                        textAlign: 'center',
                                      }}
                                    >
                                      <Typography textAlign="center" fontWeight="bold">
                                        Grid Out
                                      </Typography>
                                      <Box mt={2}>
                                        <GridOut />
                                      </Box>
                                    </Box>

                                    {/* Graph rendered outside the card */}

                                  </>
                                )}
                              </Grid>



                            </Grid>
                          </Box>

                        )}
</Box>



                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2">No gateways available</Typography>
                  )}
                </Box>
              </Box>


            </Box>
          </Grid>








        </Grid>


      </Grid>
    </Box>
  )
}

export default ProjectManager
