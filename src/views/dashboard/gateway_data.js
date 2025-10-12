import { 
  Box, Typography, IconButton, Grid, Divider, useTheme 
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Placeholder function - replace with your actual implementation
const getIconAndBgColor = (purpose) => {
  // Return appropriate icon/colors based on purpose
  return { 
    icon: <div>Icon</div>, 
    bgColor: '#2196f3', 
    mainBoxBg: '#e3f2fd' 
  };
};

function GatewayData() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { gatewayId, gatewayName, projectId, projectName } = location.state || {};
  
  // State management
  const [gateway, setGateway] = useState(null);
  const [metadataData, setMetadataData] = useState({});
  const [expandedAnalyzers, setExpandedAnalyzers] = useState({});

  // Fetch data from backend (placeholder)
  useEffect(() => {
    // Replace with actual API call
    const fetchData = async () => {
      try {
        // Example: const res = await fetch(`your-backend-url/${gatewayId}`);
        // const data = await res.json();
        setGateway({
          gateway_name: gatewayName,
          mac_address: '00:1A:2B:3C:4D:5E' // Example data
        });
        
        // Example metadata structure
        setMetadataData({
          [gatewayName]: {
            ports: [
              {
                port_name: "Port 1",
                analyzers: [
                  {
                    name: "Analyzer 1",
                    status: true,
                    type: "grid",
                    values: [
                      { name: "Voltage", value: "230V", address: "0x01" },
                      { name: "Current", value: "15A", address: "0x02" }
                    ]
                  }
                ]
              }
            ]
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (gatewayId) fetchData();
  }, [gatewayId, gatewayName]);

  const toggleAnalyzer = (key) => {
    setExpandedAnalyzers(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const navigateToChart = (name, gatewayName) => {
    // Implement your navigation logic
    navigate(`/chart/${gatewayName}/${name}`);
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
              left: '10px',
            }}
          >
            {React.cloneElement(icon, { style: { color: 'white' } })}
          </Box>
        )}

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Gateway Data</Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography><strong>Project Name:</strong> {projectName}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography><strong>Project ID:</strong> {projectId}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography><strong>Gateway Name:</strong> {gatewayName}</Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        {gateway && (
          <TreeBox
            purpose="Gateway"
            label={
              <>
                Gateway: {gateway.gateway_name} <br />
                Mac Address: {gateway.mac_address}
              </>
            }
          />
        )}

        <Box sx={{ mt: 4 }}>
          {gateway && metadataData[gateway.gateway_name] ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                flexWrap: 'wrap',
                gap: 2,
                mt: 2,
              }}
            >
              {metadataData[gateway.gateway_name].ports.map((port, portIndex) => (
                <Box
                  key={portIndex}
                  sx={{
                    flex: '1 1 300px',
                    minWidth: '280px',
                    background: theme.palette.background.paper,
                    borderRadius: '12px',
                    boxShadow: 2,
                    p: 2,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-10px',
                      background: `linear-gradient(135deg,#E8489E 0%,#E62E8E 20%,#D32999 40%, #A31DB3 60%,#9F1CB5 80%, #8723C1 100%)`,
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '6px',
                    }}
                  >
                    {port.port_name}
                  </Box>

                  {port.analyzers.map((analyzer, analyzerIndex) => {
                    const analyzerKey = `${gateway.gateway_name}-${port.port_name}-${analyzer.name}`;
                    const isExpanded = expandedAnalyzers[analyzerKey] || false;

                    return (
                      <Box key={analyzerIndex} sx={{ mt: 2 }}>
                        <TreeBox
                          purpose="Analyzer"
                          label={
                            <Box sx={{ width: '100%' }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {analyzer.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Box
                                    sx={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: '50%',
                                      backgroundColor: analyzer.status ? 'success.main' : 'error.main',
                                    }}
                                  />
                                  <IconButton size="small">
                                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                                  </IconButton>
                                </Box>
                              </Box>

                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  mt: 1,
                                  gap: 1,
                                }}
                              >
                                {analyzer.values.slice(0, 2).map((val, idx) => (
                                  <Box key={idx} sx={{ flex: 1, textAlign: 'left' }}>
                                    <Typography variant="body2" fontWeight="600">
                                      {val.name}
                                    </Typography>
                                    <Typography variant="body2" noWrap>
                                      {val.value}
                                    </Typography>
                                  </Box>
                                ))}
                                <Box>
                                  {analyzer.type === 'grid' && (
                                    <img
                                      src="https://mexemai.com/bucket/ems/image/gridcolor.png"
                                      alt="Grid"
                                      style={{ height: 22 }}
                                    />
                                  )}
                                  {/* Add other analyzer types here */}
                                </Box>
                              </Box>
                            </Box>
                          }
                          onClick={() => toggleAnalyzer(analyzerKey)}
                        />

                        {isExpanded && (
                          <Box sx={{ mt: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Grid container spacing={1}>
                              {analyzer.values.map((val, valIndex) => (
                                <Grid item xs={12} sm={6} key={valIndex}>
                                  <Box
                                    sx={{
                                      p: 1,
                                      bgcolor: 'background.paper',
                                      borderRadius: 1,
                                      cursor: 'pointer',
                                      '&:hover': { boxShadow: 1 },
                                    }}
                                    onClick={() => navigateToChart(val.name, gateway.gateway_name)}
                                  >
                                    <Grid container alignItems="center" spacing={1}>
                                      <Grid item xs={4}>
                                        <Typography variant="body2"><strong>Name</strong></Typography>
                                        <Typography variant="body2">{val.name}</Typography>
                                      </Grid>
                                      <Grid item xs={4}>
                                        <Typography variant="body2"><strong>Value</strong></Typography>
                                        <Typography variant="body2">{val.value}</Typography>
                                      </Grid>
                                      <Grid item xs={4}>
                                        <Typography variant="body2"><strong>Address</strong></Typography>
                                        <Typography variant="body2">{val.address}</Typography>
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>
          ) : (
            <TreeBox label="No metadata available." />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default GatewayData;