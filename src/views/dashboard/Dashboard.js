import React, { useState, useEffect } from 'react'
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
  useTheme,
  Button,
  Avatar,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import DevicesIcon from '@mui/icons-material/Devices'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AssignmentIcon from '@mui/icons-material/Assignment'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import WidgetsDropdownuser from '../widgets/WidgetsDropdownuser'

import urls from '../../urls/urls'
import axios from 'axios'
import BarChartComponent from '../../components/barchart'
import { useNavigate } from 'react-router-dom'
import { ColorModeContext } from '../theme/ThemeContext'
import GraphContainer from '../../components/GraphContainer'
import AddProject from './AddProject'
import { getUserIdFromLocalStorage } from '../../data/localStorage';


const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [totalUser, setTotalUsers] = useState([])
  const [hardwareCount, setHardwareCount] = useState(0)
  const [deployedHardwareCount, setDeployedHardwareCount] = useState(0)
  const [userdeployedHardwareCount, setUserDeployedHardwareCount] = useState(0)
  const [userAlotedGatewaysCount, setUserAlotedGatewaysCount] = useState(0)
  const [totalProjectsCount, setTotalProjectsCount] = useState(0)
  const [userProjectsCount, setUserProjectsCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [projects, setProjects] = useState([])
  const[adminHardwareCount, setAdminHardwareCount] = useState(0)


  const id = projects.PM_id
  const [selectedProject, setSelectedProject] = useState(null)
  const [role, setRole] = useState('');
  const [userProjects, setUserProjects] = useState([]);
  const [totalUserGateways, setTotalUserGateways] = useState([]);
  const [adminGatewayCount, setAdminGatewayCount] = useState(0);


  
  useEffect(() => {
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setRole(user.role || ''); // Set role from localStorage
    }
  }, []);
  const theme = useTheme()

  const xAxisData = ['group A', 'group B', 'group C']
  const seriesData = [{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]

  const filteredProjects = projects
    .filter(
      (project) =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.PM_id?.toString().includes(searchTerm) ||
        project.user_firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.address?.toLowerCase().includes(searchTerm.toLowerCase()),
        
    )
    .sort((a, b) => {
      const search = searchTerm.toLowerCase()
      const aStarts = a.name?.toLowerCase().startsWith(search)
      const bStarts = b.name?.toLowerCase().startsWith(search)
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      return 0
    })

    const filteredUserProjects = userProjects
    .filter(
      (project) =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.PM_id?.toString().includes(searchTerm) ||
        project.address?.toLowerCase().includes(searchTerm.toLowerCase()),
        
    )
    .sort((a, b) => {
      const search = searchTerm.toLowerCase()
      const aStarts = a.name?.toLowerCase().startsWith(search)
      const bStarts = b.name?.toLowerCase().startsWith(search)
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      return 0
    })

    useEffect(() => {
      const fetchTotalUsers = async () => {
        try {
          const response = await fetch(urls.fetchUser);
          if (response.ok) {
            const data = await response.json();
    
            console.log('User API response:', data); // 👈 check the response structure
    
            const currentUserId = getUserIdFromLocalStorage();
    
            // If the response is an array directly (not { users: [...] })
            const usersArray = Array.isArray(data)
              ? data
              : Array.isArray(data.users)
              ? data.users
              : [];
    
            const filteredUsers = usersArray.filter(
              user => String(user.created_by_id) === String(currentUserId)
            );
    
            console.log('Filtered Users:', filteredUsers);
            setTotalUsers(filteredUsers.length);
          } else {
            console.error('Failed to fetch users:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchTotalUsers();
      const intervalId = setInterval(fetchTotalUsers, 5000);
      return () => clearInterval(intervalId);
    }, []);
    
    
 //fetch admin hardware count
 useEffect(() => {
 const fetchAdminHardwareCount = async () => {
  try {
    const response = await axios.get(urls.totalGateways);
    const userId = getUserIdFromLocalStorage();

    const filteredData = response.data.Gateways.filter(
      (item) => String(item.created_by_id) === String(userId)
    );

    // Get the count directly from filteredData
    const filteredHardwareCount = filteredData.length;
    
    // Set the count directly to state
    setAdminGatewayCount(filteredHardwareCount); // 👈 Fixed here
    console.log('Filtered hardware count:', filteredHardwareCount);

    // Remove the transformedHardware mapping as it's not needed for the count
  } catch (error) {
    console.error('Error fetching gateway:', error);
  }
};
fetchAdminHardwareCount();
const intervalId = setInterval(fetchAdminHardwareCount, 5000);
return () => clearInterval(intervalId);
}, []);

//admin user allotedcount

// Add new state for user-alloted count
const [userAllotedCount, setUserAllotedCount] = useState(0);
const [adminDeployedCount, setAdminDeployedCount] = useState(0);

// Add this useEffect hook
useEffect(() => {
  const fetchUserDeployedCount = async () => {
    try {
      const response = await axios.get(urls.totalGateways);
      const userId = getUserIdFromLocalStorage();

      const filteredData = response.data.Gateways.filter(
        (item) => 
          String(item.created_by_id) === String(userId) && 
          item.deploy_status === "deployed"
      );

      const allotedCount = filteredData.length;
      setAdminDeployedCount(allotedCount);
      console.log('User-alloted hardware count:', allotedCount);
    } catch (error) {
      console.error('Error fetching gateway:', error);
    }
  };

  fetchUserDeployedCount();
  const intervalId = setInterval(fetchUserDeployedCount, 5000);
  return () => clearInterval(intervalId);
}, []);

// Add this useEffect hook
useEffect(() => {
  const fetchUserAllotedCount = async () => {
    try {
      const response = await axios.get(urls.totalGateways);
      const userId = getUserIdFromLocalStorage();

      const filteredData = response.data.Gateways.filter(
        (item) => 
          String(item.created_by_id) === String(userId) && 
          item.deploy_status === "user_aloted"
      );

      const allotedCount = filteredData.length;
      setUserAllotedCount(allotedCount);
      console.log('User-alloted hardware count:', allotedCount);
    } catch (error) {
      console.error('Error fetching gateway:', error);
    }
  };

  fetchUserAllotedCount();
  const intervalId = setInterval(fetchUserAllotedCount, 5000);
  return () => clearInterval(intervalId);
}, []);


  // Fetch Total Hardware
  useEffect(() => {
    const fetchTotalGatewayCount = async () => {
      try {
        const response = await fetch(urls.totalGatewaysCount)
        if (response.ok) {
          const data = await response.json()
          setHardwareCount(data.gateways_count)
        } else {
          console.error('Failed to fetch Gateway:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Error fetching Gateway count:', error)
      }
    }
    fetchTotalGatewayCount()
    const intervalId = setInterval(fetchTotalGatewayCount, 5000)
    return () => clearInterval(intervalId)
  }, [])

  // Fetch Aloted Hardware
  useEffect(() => {
    const fetchUserAlotedGateways = async () => {
      try {
        const response = await axios.get(urls.userAlotedGatewaysCount)
        setUserAlotedGatewaysCount(response.data.user_aloted_count)
      } catch (error) {
        console.error('Error in fetching user aloted gateways count', error)
      }
    }
    fetchUserAlotedGateways()
    const intervalId = setInterval(fetchUserAlotedGateways, 5000)
    return () => clearInterval(intervalId)
  }, [])

  // Fetch Deployed Hardware
  useEffect(() => {
    const fetchDeployedGatewayCount = async () => {
      try {
        const response = await fetch(urls.deployedGatewaysCount)
        if (response.ok) {
          const data = await response.json()
          setDeployedHardwareCount(data.deployed_gateways_count)
        } else {
          console.error('Failed to fetch Deployed Gateway:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Error fetching Deployed Gateway count:', error)
      }
    }
    fetchDeployedGatewayCount()
    const intervalId = setInterval(fetchDeployedGatewayCount, 5000)
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





  useEffect(() => {

        const fetchProjects = async () => {
    try {
      const response = await axios.get(urls.getUserProjects()); // Get URL from the helper
      console.log("USER projects:", response.data);

      setUserProjects(Array.isArray(response.data.project_managers) ? response.data.project_managers : []);
    } catch (error) {
      console.error("Error Fetching Projects", error);
    } finally {
      setLoading(false);
    }
  };

    fetchProjects(); // Call initially
  
    const intervalId = setInterval(() => {
      fetchProjects(); // Poll every 5 seconds
    }, 5000);
  
    return () => clearInterval(intervalId); // Clear on unmount
  }, []);
  

  // Total Projects
  useEffect(() => {
    const fetchTotalUserProjectsCount = async () => {
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

    fetchTotalUserProjectsCount()
    const intervalId = setInterval(fetchTotalUserProjectsCount, 1000)
    return () => clearInterval(intervalId)
  }, [])


  

  




  
  useEffect(() => {
    const getToalProject = async () => {
      try {
        const response = await axios.get(urls.getToalProject);
        const allProjects = response.data.projects;
  
        const currentUserId = Number(getUserIdFromLocalStorage());
  
        const filteredProjects = allProjects.filter(
          project => project.created_by_id === currentUserId
        );
  
        console.log('All Projects:', allProjects);
        console.log('Current User ID:', currentUserId);
        console.log('Filtered Projects:', filteredProjects);
  
        setProjects(filteredProjects);
        setTotalProjectsCount(filteredProjects.length); // 👈 set the length here
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
  
    getToalProject();
    const intervalId = setInterval(getToalProject, 2000);
    return () => clearInterval(intervalId);
  }, []);
  
  
  

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
  

  const handleProjectClick = (project) => {
    navigate('/dashboard/project_data', {
      state: {
        projectName: project.name,
        projectId: project.PM_id,
        longitude: project.longitude,
        latitude: project.latitude,
        address: project.address,
        connected_gateways: project.connected_gateways || [],
      },
    });
  };

  useEffect(() => {
    const storedProjectId = localStorage.getItem('selectedProjectId');
    if (storedProjectId) {
      setSelectedProject(storedProjectId);
    }
  }, []);
  

  return (
    <Box sx={{ padding: 2}}>

{ role === 'user' &&
            <Box sx={{mb:3}}>
              
      <Typography variant="h4" fontWeight={700}>
        Dashboard
      </Typography>
            <Typography variant="body1"  fontWeight={700} >Welcome to Dashboard</Typography>
            
            </Box>}

      {/* Dashboard Cards */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
      { role === 'admin' && <WidgetsDropdown
        title={loading ? 'Loading...' : totalUser}
        subtitle="Total Users"
        icon={<PeopleIcon fontSize="large" />}
        bgColor="linear-gradient(135deg,rgb(103, 182, 247),rgb(50, 120, 185))" // Blue
      />}



        {/*admin cards*/}
        {role === 'admin' &&
          <WidgetsDropdown
            title={loading ? 'Loading...' : adminGatewayCount}
            subtitle="Total Hardware"
            icon={<DevicesIcon fontSize="large" />}
            bgColor="linear-gradient(135deg,rgb(131, 219, 136), #43a047)" // Green
          />}

        {role === 'admin' && (
          <WidgetsDropdown
            title={loading ? 'Loading...' : userAllotedCount}
            subtitle="Aloted Hardware"
            icon={<CheckCircleIcon fontSize="large" />}
            bgColor="linear-gradient(135deg,rgb(248, 205, 141), #fb8c00)" // Orange
          />)}

        {role === 'admin' && (<WidgetsDropdown
          title={loading ? 'Loading...' : adminDeployedCount}
          subtitle="Deployed Hardware"
          icon={<CloudUploadIcon fontSize="large" />}
          bgColor="linear-gradient(135deg,rgb(187, 155, 243), #5e35b1)" // Purple
        />)}




        {role === 'user' && (
  <WidgetsDropdownuser
    title={loading ? 'Loading...' : totalUserGateways}
    subtitle="Total Hardware"
    icon={<DevicesIcon fontSize="large" />}
    bgColor="#7978E9" // Green
  />
)}

 {role === 'user' && (
<WidgetsDropdownuser
          title={loading ? 'Loading...' : totalUserGateways}
          subtitle="Aloted Hardware"
          icon={<CheckCircleIcon fontSize="large" />}
          bgColor="#2FC87B" // Orange
        />)}

        {role === 'user' && (<WidgetsDropdownuser
          title={loading ? 'Loading...' : userdeployedHardwareCount}
          subtitle="Deployed Hardware"
          icon={<CloudUploadIcon fontSize="large" />}
          bgColor="#F3797E" // Purple
        />)}

{role === 'admin' &&(        <WidgetsDropdown
          title={loading ? 'Loading...' : totalProjectsCount}
          subtitle="Total Projects"
          icon={<AssignmentIcon fontSize="large" />}
          bgColor="linear-gradient(135deg,rgb(250, 150, 148), #e53935)" // Red
        />)}

 {role === 'user' && (
<WidgetsDropdownuser
          title={loading ? 'Loading...' : userProjectsCount}
          subtitle="Total Projects"
          icon={<AssignmentIcon fontSize="large" />}
          bgColor="#0DCAF0" // Red
        />)}
      </Box>
     

      <Box sx={{  mt: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
            background: 'linear-gradient(135deg,rgb(103, 182, 247),rgb(50, 120, 185))',
            padding: '10px',
            borderRadius: ' 8px',
          }}
        >
          {/* Left: Heading */}
          <Typography variant="h5">User Projects</Typography>

          {/* Right: Search Bar */}
          <TextField
            variant="outlined"
            placeholder="Search User"
            size="small"
            sx={{
              width: '250px',
              background: theme.palette.background.paper,
              border: 'none',
              borderRadius: '4px',
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
                     {role === 'user' && <AddProject />}
          
        </Box>
        {/* Table for displaying data */}
        {role === 'admin' &&
        <TableContainer component={Paper} sx={{ overflow: "visible" }}>
          <Table>
            <TableHead>
              <TableRow >
              <TableCell style={{ fontWeight: 'bold' }}>Sr No</TableCell>

                <TableCell style={{ fontWeight: 'bold' }}>Project ID</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Project Name</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Username</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Address</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjects.map((project, index) => (
                <TableRow
                hover
                
                key={project.PM_id || index}
                onClick={() => handleProjectClick(project)}
                style={{ cursor: 'pointer', 
                  transition: "all 0.3s ease-in-out", // Smooth transition
                  borderRadius: "8px", // Rounded effect
                  overflow: "hidden", // Prevents content overflow
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
                  e.currentTarget.style.backgroundColor = theme.palette.background.paper;
                }} // Expand with shadow effect
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.backgroundColor = "transparent"; }}
                  
              >
                  <TableCell>{index +1}</TableCell>

                  <TableCell>{project.PM_id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>
  <Box display="flex" alignItems="center" gap={1}>
    <Avatar
      src={project.user_image}
      alt={project.user_firstname}// use the base64 image here
      sx={{ width: 32, height: 32 }}
    >
      {project.user_firstname?.[0] || 'U'} {/* Fallback letter if image fails */}
    </Avatar>
    <Typography variant="body2">{project.user_firstname}</Typography>
  </Box>
</TableCell>
                  <TableCell>{project.address}</TableCell>
                  
                  <TableCell align="center">
  {project.is_active ? (
    <Button
      variant="contained"
      size="small"
      disableElevation
      disableRipple
      sx={{
        p: 0,
        px: 1,
        bgcolor: '#4EA44D',
        color: 'white',
        fontSize: '12px',
        fontWeight: '600',
        boxShadow: 'none',
        pointerEvents: 'none',
        cursor: 'default',
        '&:hover': {
          bgcolor: '#4EA44D',
          boxShadow: 'none',
        },
      }}
    >
      Active
    </Button>
  ) : (
    <Button
      variant="contained"
      size="small"
      disableElevation
      disableRipple
      sx={{
        p: 0,
        px: 1,
        bgcolor: 'red',
        color: 'white',
        fontSize: '12px',
        fontWeight: '600',
        boxShadow: 'none',
        pointerEvents: 'none',
        cursor: 'default',
        '&:hover': {
          bgcolor: 'red',
          boxShadow: 'none',
        },
      }}
    >
      Inactive
    </Button>
  )}
</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        }

{role === 'user' && 
  <TableContainer component={Paper} sx={{ overflow: "visible" }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell style={{ fontWeight: 'bold' }}>Sr No</TableCell>
          <TableCell style={{ fontWeight: 'bold' }}>Project ID</TableCell>
          <TableCell style={{ fontWeight: 'bold' }}>Project Name</TableCell>
          <TableCell style={{ fontWeight: 'bold' }}>Address</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Total Gateways</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Active Gateways</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Non Active Gateways</TableCell>


          <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredUserProjects.map((project, index) => (
          <TableRow
            hover
            key={project.PM_id || index}
            onClick={() => handleProjectClick(project)}
            style={{ cursor: 'pointer', transition: "all 0.3s ease-in-out", borderRadius: "8px", overflow: "hidden" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
              e.currentTarget.style.backgroundColor = theme.palette.background.paper;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <TableCell>{index + 1}</TableCell> {/* Serial Number */}
            <TableCell>{project.PM_id}</TableCell>
            <TableCell>{project.name}</TableCell>
            <TableCell>{project.address}</TableCell>
            <TableCell> {project.connected_gateways?.length ?? 0}</TableCell>
            <TableCell>0</TableCell>
                        <TableCell>0</TableCell>


            
            <TableCell align="center">
  {project.is_active ? (
    <Button
      variant="contained"
      size="small"
      disableElevation
      disableRipple
      sx={{
        p: 0,
        px: 1,
        bgcolor: '#4EA44D',
        color: 'white',
        fontSize: '12px',
        fontWeight: '600',
        boxShadow: 'none',
        pointerEvents: 'none',
        cursor: 'default',
        '&:hover': {
          bgcolor: '#4EA44D',
          boxShadow: 'none',
        },
      }}
    >
      Active
    </Button>
  ) : (
    <Button
      variant="contained"
      size="small"
      disableElevation
      disableRipple
      sx={{
        p: 0,
        px: 1,
        bgcolor: 'red',
        color: 'white',
        fontSize: '12px',
        fontWeight: '600',
        boxShadow: 'none',
        pointerEvents: 'none',
        cursor: 'default',
        '&:hover': {
          bgcolor: 'red',
          boxShadow: 'none',
        },
      }}
    >
      Inactive
    </Button>
  )}
</TableCell>

          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
}

      </Box>
    </Box>
  )
}

export default Dashboard
