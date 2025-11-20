import React, { useEffect, useState } from 'react'
import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import DevicesIcon from '@mui/icons-material/Devices'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AssignmentIcon from '@mui/icons-material/Assignment'
import WidgetsDropdown from './../widgets/WidgetsDropdown'
import axios from 'axios'
import urls from '../../urls/urls'
import { useNavigate } from "react-router-dom";


const DashBoard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [userAlotedGatewaysCount, setUserAlotedGatewaysCount] = useState(0)
  const [deployedHardwareCount, setDeployedHardwareCount] = useState(0)
  const [hardwareCount, setHardwareCount] = useState(0)
  const [totalUser, setTotalUsers] = useState([])
  const [totalAdmins, setTotalAdmins] = useState([])
  const [adminDetails, setAdminDetails] = useState([]);
  const [superAdminTotalProjectCount, setSuperAdminTotalProjectCount] = useState(0)
  const [allUsers, setAllUsers] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [enrichedAdminDetails, setEnrichedAdminDetails] = useState([]);
  const navigate = useNavigate();






  useEffect(() => {
    const getSuperAdminTotalProject = async () => {
      try {
        const response = await axios.get(urls.Get_superAdmin_Project_Count);
        const data = response.data.total_projects;
        console.log('Projects:', data);


        setSuperAdminTotalProjectCount(data);
      } catch (error) {
        console.error('Error fetching user gateways:', error);
      }
    };

    getSuperAdminTotalProject(); // Call it once initially
    const intervalId = setInterval(getSuperAdminTotalProject, 5000); // Then every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);



  // const dummyData = [
  //   { id: 1, username: 'JohnDoe', email: 'johndoe@example.com', totalUsers: 50, totalProjects: 10 },
  //   {
  //     id: 2,
  //     username: 'JaneSmith',
  //     email: 'janesmith@example.com',
  //     totalUsers: 75,
  //     totalProjects: 15,
  //   },
  //   {
  //     id: 3,
  //     username: 'MikeBrown',
  //     email: 'mikebrown@example.com',
  //     totalUsers: 30,
  //     totalProjects: 5,
  //   },
  //   {
  //     id: 4,
  //     username: 'EmilyClark',
  //     email: 'emilyclark@example.com',
  //     totalUsers: 60,
  //     totalProjects: 12,
  //   },
  //   {
  //     id: 5,
  //     username: 'DavidWilson',
  //     email: 'davidwilson@example.com',
  //     totalUsers: 90,
  //     totalProjects: 20,
  //   },
  // ]



  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get(urls.adminDetails);
        if (response.data) {
          setAdminDetails(response.data); // Response is already an array
          console.log("response data admin", response.data);

        }
      } catch (error) {
        console.error('Error fetching admin details:', error);
      }
    };

    fetchAdminDetails();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, projectsResponse] = await Promise.all([
          axios.get(urls.fetchUser),
          axios.get(urls.getToalProject),
        ]);

        const users = Array.isArray(usersResponse.data)
          ? usersResponse.data
          : usersResponse.data.users || [];

        const projects = Array.isArray(projectsResponse.data)
          ? projectsResponse.data
          : projectsResponse.data.projects || [];

        setAllUsers(users);
        setAllProjects(projects);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   if (adminDetails.length) {
  //     const updatedAdminDetails = adminDetails.map((admin) => {
  //       const totalUsers = allUsers?.filter(
  //         (user) => String(user.created_by_id) === String(admin.id)
  //       ).length || 0;

  //       const totalProjects = allProjects?.filter(
  //         (project) => String(project.created_by_id) === String(admin.id)
  //       ).length || 0;

  //       return {
  //         ...admin,
  //         totalUsers,
  //         totalProjects,
  //       };
  //     });

  //     setEnrichedAdminDetails(updatedAdminDetails);
  //   }
  // }, [adminDetails, allUsers, allProjects]);

  // Fetch Total Admins

  useEffect(() => {
    setEnrichedAdminDetails(adminDetails);
  }, [adminDetails]);


  useEffect(() => {
    const fetchTotalAdmins = async () => {
      try {
        const response = await fetch(urls.adminCount)
        if (response.ok) {
          const data = await response.json()
          setTotalAdmins(data.admin_users)
        } else {
          console.error('Failed to fetch user count:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Error fetching user count:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTotalAdmins()
    const intervalId = setInterval(fetchTotalAdmins, 5000)
    return () => clearInterval(intervalId)
  }, [])


  // Fetch Total Users
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch(urls.userCount)
        if (response.ok) {
          const data = await response.json()
          console.log("Total Users:", data);
          setTotalUsers(data.total_users)
        } else {
          console.error('Failed to fetch user count:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Error fetching user count:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTotalUsers()
    const intervalId = setInterval(fetchTotalUsers, 5000)
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

  // Fetch Aloted Hardware
  useEffect(() => {
    const fetchUserAlotedGateways = async () => {
      try {
        const response = await axios.get(urls.userAlotedGatewaysCount)
        setUserAlotedGatewaysCount(response.data.user_aloted_count)
      } catch (error) {
        console.error('Error in fetching user aloted gateways count', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserAlotedGateways()
    const intervalId = setInterval(fetchUserAlotedGateways, 5000)
    return () => clearInterval(intervalId)
  }, [])

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

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <WidgetsDropdown
          title={loading ? 'Loading...' : totalAdmins}
          subtitle="Total Admin"
          icon={<PeopleIcon fontSize="medium" />}
          bgColor="linear-gradient(135deg, #000000, #1a1a1a, #333333);"
        />
        <WidgetsDropdown
          title={loading ? 'Loading...' : totalUser}
          subtitle="Total Users"
          icon={<PeopleIcon fontSize="medium" />}
          bgColor="linear-gradient(135deg,rgb(103, 182, 247),rgb(50, 120, 185))" // Blue
        />
        {/* <WidgetsDropdown
          title={loading ? 'Loading...' : userAlotedGatewaysCount}
          subtitle="Aloted Hardware"
          icon={<CheckCircleIcon fontSize="large" />}
          bgColor="linear-gradient(135deg,rgb(248, 205, 141), #fb8c00)" // Orange
        />
        <WidgetsDropdown
          title={loading ? 'Loading...' : deployedHardwareCount}
          subtitle="Deployed Hardware"
          icon={<CloudUploadIcon fontSize="large" />}
          bgColor="linear-gradient(135deg,rgb(187, 155, 243), #5e35b1)" // Purple
        />
        <WidgetsDropdown
          title={loading ? 'Loading...' : hardwareCount}
          subtitle="Total Hardware"
          icon={<DevicesIcon fontSize="large" />}
          bgColor="linear-gradient(135deg,rgb(131, 219, 136), #43a047)" // Green
        />
        <WidgetsDropdown
          title={superAdminTotalProjectCount}
          subtitle="Total Projects"
          icon={<AssignmentIcon fontSize="large" />}
          bgColor="linear-gradient(135deg,rgb(250, 150, 148), #e53935)"
        /> */}
      </Box>

      <Box sx={{ mt: 4 }}>
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
          <Typography variant="h5">Admin Details</Typography>

          {/* Right: Search Bar */}
          <TextField
            variant="outlined"
            placeholder="Search "
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
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Sr No.</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Username</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Total Users</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Total Projects</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {enrichedAdminDetails
                .filter((admin) =>
                  admin.username?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((admin, index) => (
                  <TableRow
                    key={admin.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                      console.log("Selected Admin ID:", admin.id);
                      navigate(`/dashboard/project_data`, { state: { adminId: admin.id } });
                    }}
                  >        <TableCell>{index + 1}</TableCell>
                    <TableCell>{admin.username || 'N/A'}</TableCell>
                    <TableCell>{admin.email || 'N/A'}</TableCell>
                    <TableCell>{admin.totalUsers || 0}</TableCell>
                    <TableCell>{admin.totalProjects || 0}</TableCell>
                  </TableRow>
                ))}
            </TableBody>



          </Table>
        </TableContainer>


      </Box>
    </Box>
  )
}

export default DashBoard
