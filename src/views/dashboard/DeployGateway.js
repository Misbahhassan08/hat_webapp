import React, { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  ListItem,
  ListItemText,
  List,
  DialogActions,
  useTheme,
} from '@mui/material'
import { AddRounded } from '@mui/icons-material'
import { useLocation } from 'react-router-dom'
import urls from '../../urls/urls'

const DeployGateway = () => {
  const location = useLocation()
  const project_id = location.state?.projectId || ''

  const [userGateways, setUserGateways] = useState([])
  const [userListGateways, setUserListGateways] = useState([])
  const [openGatewayPop, setOpenGatewayPop] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectGateway, setSelectGateway] = useState(null)
  const [currentProjectId, setCurrentProjectId] = useState(null)
  const [error, setError] = useState(null)
  const theme = useTheme()

  const loggedInUser = JSON.parse(localStorage.getItem("user"))
  const userId = loggedInUser?.user_id

  useEffect(() => {
    setCurrentProjectId(project_id)
  }, [project_id])

  useEffect(() => {
    console.log("Selected Gateway:", selectGateway)
  }, [selectGateway])

  const fetchGateways = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${urls.userlistGateways}?user_id=${userId}`)
      const data = await response.json()
      console.log("Gateways Data:", data.Gateways)

      const transformedGateways = (data.Gateways || []).map((item) => {
        let deployStatus = ""
        if (item.deploy_status === "user_aloted") {
          deployStatus = "Alloted to User"
        } else if (item.deploy_status === "warehouse") {
          deployStatus = "In Warehouse"
        } else if (item.deploy_status === "deployed") {
          deployStatus = "Deployed to User"
        }
        return {
          ...item,
          deploy_status: deployStatus,
        }
      })

      setUserListGateways(transformedGateways)
      setUserGateways(transformedGateways)
    } catch (err) {
      setError("Error occurred while fetching data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchGateways()
    }
  }, [userId])

  const handleDeploy = async () => {
    console.log("deploy function call");
    
    if (!selectGateway) return
    console.log("gateway id",selectGateway);
    

    try {
      const gatewayData = {
        G_id: selectGateway.G_id,
        deploy_status: "deployed",
        // project_id: currentProjectId,
      }
      console.log("gateway data", gatewayData);
      

      const response = await fetch(`${urls.updateGateway}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gatewayData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Successfully updated deploy status:", data)
        await fetchGateways() // Refresh list
      } else {
        const data = await response.json()
        setError(data.message || "Failed to update deploy status")
      }
    } catch (err) {
      setError("Error occurred while updating deploy status")
      console.error(err)
    }

    setSelectGateway(null)
    handleGatewayPopClose()
  }

  const handleGatewayClick = (gateway) => {
    setSelectGateway(gateway)
  }

  const handleGatewayPopOpen = () => {
    fetchGateways()
    setOpenGatewayPop(true)
  }

  const handleGatewayPopClose = () => {
    setOpenGatewayPop(false)
  }

  useEffect(() => {
    if (openGatewayPop) {
fetchGateways()

    }
  }, [openGatewayPop])

  return (
    

    <Box >
     
      {/* < AddRounded sx={{ color: "white" }} aria-label="add_project" />   */}


      <Button
        onClick={handleGatewayPopOpen}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          // gap: "8px",
          padding: "10px",
          width:'100%',
          backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#43A48C',

          borderRadius: "12px",
          mb:"10px",
          mt:"15px"
        }}   
      >
       
        <Typography sx={{ color: theme.palette.mode === 'light' ? 'black' : 'white', fontSize: "14px", fontWeight: 600 }}>
          Deploy Gateway
        </Typography>
      </Button>
      
      
      

      <Dialog
        open={openGatewayPop}
        onClose={handleGatewayPopClose}
        sx={{
          "& .MuiDialog-container": {
            width: "100%",
          },
          "& .MuiDialog-paper": {
            width: "100%",
          },
        }}
        PaperProps={{
          style: {
            boxShadow: "none",
          },
        }}
      >
        <DialogTitle>Gateways Assigned</DialogTitle>

        <DialogContent>
          {loading && <Typography>Loading...</Typography>}
          {!loading && userListGateways.length > 0 && (
            <List>
              {userListGateways.map((gateway) => (
                <ListItem
                  key={gateway.G_id}
                  sx={{
                    cursor: gateway.deploy_status === "Deployed to User" ? "not-allowed" : "pointer",
                    backgroundColor:
                      selectGateway?.G_id === gateway.G_id
                        ? "rgb(102, 125, 187)"
                        : theme.palette.background.paper,
                    color: "#fff",
                    marginBottom: "5px",
                    borderRadius: "8px",
                    padding: "10px",
                    opacity: gateway.deploy_status === "Deployed to User" ? 0.5 : 1,
                    pointerEvents: gateway.deploy_status === "Deployed to User" ? "none" : "auto",
                    "&:hover": gateway.deploy_status !== "Deployed to User"
                      ? { backgroundColor: "rgb(102, 125, 187)" }
                      : {},
                  }}
                  onClick={() => {
                    if (gateway.deploy_status !== "Deployed to User") {
                      handleGatewayClick(gateway)
                    }
                  }}
                >
                  <ListItemText
                    sx={{ color: theme.palette.text.primary }}
                    primary={`${gateway.G_id} - ${gateway.gateway_name}`}
                    secondary={`MAC: ${gateway.mac_address} - Status: ${gateway.deploy_status}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
          {!loading && userGateways.length === 0 && (
            <Typography>No gateways available</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleGatewayPopClose} color="primary">
            Close
          </Button>
          {selectGateway &&
            selectGateway.deploy_status !== "Deployed to User" && (
              <Button
                onClick={handleDeploy}
                variant="contained"
                sx={{ color: "white" }}
              >
                Deploy
              </Button>
            )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DeployGateway
