import React, { useState, useEffect } from 'react'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import PeopleIcon from '@mui/icons-material/People'
import DevicesIcon from '@mui/icons-material/Devices'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AssignmentIcon from '@mui/icons-material/Assignment'
import GraphContainer from '../../components/GraphContainer'
import { Box } from '@mui/material'
import { getUserIdFromLocalStorage } from '../../data/localStorage';
import urls from '../../urls/urls'
import axios from 'axios'



const analytics = () => {
    const [loading, setLoading] = useState(true)
    const [UserProjectsCount, setUserProjectsCount] = useState(true)
    const [totalUserGateways, setTotalUserGateways] = useState([]);
    const [userdeployedHardwareCount, setUserDeployedHardwareCount] = useState(0)
    
    



  useEffect(() => {
    const getTotalUsergateways = async () => {
      try {
        const response = await axios.get(`${urls.fetchTotalUserGateways}?user_id=${getUserIdFromLocalStorage()}`);
        const data = response.data.gateways_count;
        console.log('Projects:', data);
        console.log('Fetching from url:', `${urls.userGateways}?user_id=${getUserIdFromLocalStorage()}`);

        setTotalUserGateways(data);
      } catch (error) {
        console.error('Error fetching user gateways:', error);
      }
    };
  
    getTotalUsergateways(); // Call it once initially
    const intervalId = setInterval(getTotalUsergateways, 5000); // Then every 5 seconds
  
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [getUserIdFromLocalStorage()]);

  
     useEffect(() => {
        const fetchUserProjectsCount = async () => {
          try {
            const response = await fetch(urls.usertotalProject)
            if (response.ok) {
              const data = await response.json()
              setUserProjectsCount(data.project_count)
            } else {
              console.error('Failed to fetch Total Projects:', response.status, response.statusText)
              Alert.alert('Error', `Failed to fetch Total Projects count: ${response.status}`)
            }
          } catch (error) {
            console.error('Error fetching Total Projects count:', error)
            Alert.alert('Error', 'Unable to fetch Total Projects count. Please try again later.')
          } finally {
            setLoading(false)
          }
        }
    
        fetchUserProjectsCount()
        const intervalId = setInterval(fetchUserProjectsCount, 500)
        return () => clearInterval(intervalId)
      }, [])

        useEffect(() => {
          const fetchUserDeployedGatewayCount = async () => {
            try {
              const response = await fetch(urls. get_deployed_gateway_count)
              if (response.ok) {
                const data = await response.json()
                setUserDeployedHardwareCount(data.deployed_gateway_count)
              } else {
                console.error('Failed to fetch Deployed Gateway:', response.status, response.statusText)
              }
            } catch (error) {
              console.error('Error fetching Deployed Gateway count:', error)
            }
          }
          fetchUserDeployedGatewayCount()
          const intervalId = setInterval(fetchUserDeployedGatewayCount, 5000)
          return () => clearInterval(intervalId)
        }, [])
  



  return (
    <Box sx={{ padding: 3 }}>
          {/* Dashboard Cards */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          
            <WidgetsDropdown
              title={loading ? 'Loading...' : totalUserGateways}
              subtitle="Total Hardware"
              icon={<DevicesIcon fontSize="large" />}
              bgColor="linear-gradient(135deg,rgb(131, 219, 136), #43a047)" // Green
            />
            <WidgetsDropdown
              title={loading ? 'Loading...' : totalUserGateways}
              subtitle="Aloted Hardware"
              icon={<CheckCircleIcon fontSize="large" />}
              bgColor="linear-gradient(135deg,rgb(248, 205, 141), #fb8c00)" // Orange
            />
            <WidgetsDropdown
              title={loading ? 'Loading...' : userdeployedHardwareCount}
              subtitle="Deployed Hardware"
              icon={<CloudUploadIcon fontSize="large" />}
              bgColor="linear-gradient(135deg,rgb(187, 155, 243), #5e35b1)" // Purple
            />
            <WidgetsDropdown
              title={loading ? 'Loading...' : UserProjectsCount}
              subtitle="Total Projects"
              icon={<AssignmentIcon fontSize="large" />}
              bgColor="linear-gradient(135deg,rgb(250, 150, 148), #e53935)" // Red
            />
          </Box>
         
         <GraphContainer/>

         </Box>
         


  )
}

export default analytics
