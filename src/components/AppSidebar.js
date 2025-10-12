import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CNavTitle,
  CNavGroup,
  CNavItem,
  CNavGroupItems
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import { sygnet } from 'src/assets/brand/sygnet'
import logo2 from '../assets/images/logo2.png'
import { getUserFromLocalStorage } from '../data/localStorage'
import _nav from '../_nav'
import { Typography } from '@mui/material'
import { Navigate, useLocation, useNavigate } from 'react-router-dom' // updated import
import axios from 'axios'
import urls from '../urls/urls'
import {  cilHouse, cilIndustry} from '@coreui/icons'
import projectIcon from '../assets/images/projecticon.svg'

const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}


const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const location = useLocation();

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [user, setUser] = useState({ name: '', avatar: '' })
  const [role, setRole] = useState('')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate() // add this line
    const [selectedProject, setSelectedProject] = useState(null)
  


  const handleProjectClick = (project) => {
    setSelectedProject(project.name);
    
    // Store selected project ID in localStorage
    localStorage.setItem('selectedProjectId', project.PM_id);
  
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


const handleGatewayClick = (e, gateway, project) => {
  e.stopPropagation();

  if (!gateway || !project) {
    console.error("Missing gateway or project:", { gateway, project });
    return;
  }

  localStorage.setItem('selectedGatewayId', gateway.gateway_id);
  localStorage.setItem('selectedProjectId', project.PM_id);

  navigate('/dashboard/project_manager', {
    state: {
   gateway
    }
  });
};


// And update the gateway item in generateProjectNavItems:
const generateProjectNavItems = () => {
  return projects.map(project => ({
    component: CNavGroup,
    name: (
      <span style={{ userSelect: 'none' }}>
        {capitalize(project.name)}
      </span>
    ),
    onClick: () => handleProjectClick(project),
    items: (project.connected_gateways || []).map(gateway => ({
      component: CNavItem,
      name: (
        <span
          onClick={(e) => {
            e.stopPropagation();
            handleGatewayClick(e, gateway, project);
          }}
          className={`custom-nav-item ${gateway.isSelected ? 'selected' : ''}`}
          style={{
            paddingLeft: 50,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          <CIcon icon={cilHouse} customClassName="nav-icon" style={{ marginRight: 10 }} />
          <span
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <span>{capitalize(gateway.gateway_name)}</span>
            <span style={{ color: gateway.deploy_status ? 'green' : 'red' }}>
              ●
            </span>
          </span>
        </span>
      ),
      onClick: () => handleProjectClick(project),
    })),
    icon: <CIcon icon={cilIndustry} customClassName="nav-icon" />,
  }));
};






  useEffect(() => {
    const storedProjectId = localStorage.getItem('selectedProjectId');
    if (storedProjectId) {
      setSelectedProject(storedProjectId);
    }
  }, []);


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(urls.getUserProjects())
        console.log("USER projects:", response.data)
        setProjects(Array.isArray(response.data.project_managers) ? response.data.project_managers : [])
      } catch (error) {
        console.error("Error Fetching Projects", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
    const intervalId = setInterval(fetchProjects, 5000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const userData = getUserFromLocalStorage()
    if (userData) {
     setUser({
  name: `${capitalize(userData.firstname)} ${capitalize(userData.lastname)}`,
  role: capitalize(userData.role),
  avatar: userData.image,
})

      setRole(userData.role || '')
    }
  }, [])




  // Filter navigation based on user role and add dynamic projects
const getFilteredNav = () => {
  const roleNavConfig = {
    superadmin: _nav.filter(item =>
      ['DashBoard', 'Dash-Board', 'Pages', 'Manage Admins', 'Manage Admin', 'Create Admin', 'Manage Gateway', 'Invoices', 'Notification'].includes(item.name)
    ),
    admin: _nav.filter(item =>
      ['DashBoard', 'Dashboard', 'Pages', 'Manage Users', 'Create User', 'Manage Hardware', 'Manage Invoices', 'View Invoices'].includes(item.name)
    ),
    user: _nav.filter(item =>
      ['DashBoard', 'Dashboard', 'Pages', 'Manage Project', 'Reporting', 'Invoices', 'User Details'].includes(item.name)
    ),
  }

  let baseNav = roleNavConfig[role] || []

  // Only for user role: insert Projects after Dashboard and before Pages
  if (role === 'user' && projects.length > 0) {
    const dashboardIndex = baseNav.findIndex(item => item.name === 'Dashboard')

    const projectNav = [
      {
        component: CNavTitle,
        name: 'Projects',
      },
      ...generateProjectNavItems(),
    ]

    // Insert Projects section right after Dashboard
    if (dashboardIndex !== -1) {
      baseNav = [
        ...baseNav.slice(0, dashboardIndex + 1),
        ...projectNav,
        ...baseNav.slice(dashboardIndex + 1),
      ]
    } else {
      baseNav = [...projectNav, ...baseNav]
    }
  }

  return baseNav
}


  const filteredNav = getFilteredNav()

  return (
    <CSidebar
      className="custom-sidebar"
      colorScheme="dark"
      
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <div className="border-bottom flex-col" style={{ padding: '20px 0' }}>
        <div style={{ textAlign: 'center' }}>


          <img
           src={logo2}       
            alt="Logo"
            style={{
              height: '120px',
              width: 'auto',
              display: 'block',
              margin: '0 auto',
            }}
            className="sidebar-brand-full"
          />
                    <div style={{ 
            color: 'white',
      
          }}>

            <Typography variant='subtitle1' sx={{fontWeight: '700'}}>Welcome to IES</Typography>
          </div>

          <div style={{
            color: 'white',
           
            marginBottom: '15px' 
          }}>
            <Typography variant='subtitle1' sx={{ fontWeight: '700'}}>Dashboard</Typography>
          </div>
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: '40px',
            color: 'white',
   
          }}
        >
<Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
  {user.name || 'Loading...'}
</Typography>
<Typography variant="title1" sx={{ fontWeight: 'bold', color: 'white' }}>
  {user.role || 'Loading...'}
</Typography>

        </div>

      </div>

      <AppSidebarNav items={filteredNav} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        {/* Footer content */}
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)