import { ThemeContext } from '@emotion/react'
import { patch } from '@mui/material'
import { element } from 'prop-types'
import React from 'react'
// import AnimatedSVGEdge from './views/dashboard/animatedSVGEdge'
const test = React.lazy(() => import('./views/test.js'))
const AccessDenied = React.lazy(() => import('./views/AccessDenied/AccessDenied.js'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard.js'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))
const ManageUsers = React.lazy(() => import ('./views/dashboard/manage_users'))
const CreateUser = React.lazy(() => import ('./views/dashboard/create_user'))
const ManageHardware = React.lazy(() => import ('./views/dashboard/manage_hardware'))
const Analytics = React.lazy(() => import ('./views/dashboard/Analytics.js'))
const Invoices = React.lazy(() => import ('./views/dashboard/invoices'))
const ManageInvoices = React.lazy(() => import ('./views/dashboard/manageInvoices'))
const ViewInvoices = React.lazy(() => import ('./views/dashboard/viewInvoices'))
const UserDetails = React.lazy(() => import ('./views/dashboard/UserDetails.js'))
const DashBoard = React.lazy(() => import('./views/dashboard/SuperAdminDashboard.js'))
const ProjectManager = React.lazy(() => import ('./views/dashboard/project_manager'))
const ProjectData = React.lazy(() => import ('./views/dashboard/project_data'))
const GatewayData = React.lazy(() => import ('./views/dashboard/gateway_data'))
const ProjectChart = React.lazy (() => import ('./views/dashboard/projectchart'))
const HighChart = React.lazy (() => import ('./views/dashboard/highchart'))
const AnimatedSVGEdge = React.lazy (() => import ('./views/dashboard/animatedSVGEdge'))
const SecondAnimatedSVGEdge = React.lazy (() => import ('./views/dashboard/secondAnimatedSVGEdge'))
const CustomNode = React.lazy (() => import ('./views/dashboard/customNodes'))
const SecondCustomNode = React.lazy (() => import ('./views/dashboard/secondCustomNodes'))
const PieChart = React.lazy (() => import ('./views/dashboard/PieChart'))
const GuageMeter = React.lazy (() => import ('./views/dashboard/GuageMeter'))
const DeployGateway = React.lazy (() => import ('./views/dashboard/DeployGateway'))
const AddProject = React.lazy (() => import ('./views/dashboard/AddProject'))
const Login = React.lazy (() => import ('./views/pages/login/Login'))
const GraphCard = React.lazy (() => import ('./components/GraphCard'))
const GraphContainer = React.lazy (() => import ('./components/GraphContainer.js'))
const ManageAdmin = React.lazy (() => import ('./views/dashboard/ManageAdmin.js'))
const CreateAdmin = React.lazy (() => import ('./views/dashboard/CreateAdmin.js'))
const ManageGateway = React.lazy (() => import ('./views/dashboard/manage_gateway.js'))
const ManageProjects = React.lazy (() => import ('./views/dashboard/manage_projects.js'))
const Notification = React.lazy (() => import ('./views/dashboard/notification.js'))







const routes = [
  {path: '/test' , name: 'test', element: test},
  {path: '/AccessDenied' , name: 'AccessDenied', element: AccessDenied},
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/dashboard/manage_users', name: 'Manage Users', element: ManageUsers },
  { path: '/dashboard/create_user' , name: 'Create User', element: CreateUser},
  { path: '/dashboard/manage_hardware' , name: 'Manage Hardware', element: ManageHardware},
  { path: '/dashboard/invoices' , name: 'Contact', element: Invoices},
  { path: '/dashboard/ManageInvoices' , name: 'Contact', element: ManageInvoices},
  { path: '/dashboard/viewInvoices' , name: 'Contact', element: ViewInvoices},
  { path: '/dashboard/UserDetails' , name: 'Contact', element: UserDetails },
  { path: '/dashboard/Analytics' , name: 'Analytics', element: Analytics},
  { path: '/dashboard/project_manager' , name: 'Project Manager', element: ProjectManager},
  { path: '/dashboard/project_data' , name: 'Project Data', element: ProjectData},
  { path: '/dashboard/gateway_data' , name: 'Gateway Data', element: GatewayData},
  { path: '/dashboard/projectchart/:gateway_name/:value_name' , name: 'Project Chart', element: ProjectChart},
  { path: '/dashboard/highchart' , name: 'Highchart', element: HighChart},
  { path: '/dashboard/animatedSVGEdge', name: 'AnimatedSVGEdge', element : <AnimatedSVGEdge />},
  { path: '/dashboard/secondAnimatedSVGEdge' , name: 'SecondAnimatedSVGEdge', element : SecondAnimatedSVGEdge},
  { path: '/dashboard/CustomNode', name: 'CustomNode', element : CustomNode},
  { path: '/dashboard/SecondCustomNode', name: 'SecondCustomNode', element: SecondCustomNode},
  { path: '/dashboard/GuageMeter', name: 'GuageMeter', element: GuageMeter},
  { path: '/dashboard/PieChart' , name: 'PieChart' , element: PieChart},
  { path: '/dashboard/DeployGateway' , name: 'DeployGateway' , element: DeployGateway},
  { path: '/dashboard/AddProject' , name: 'AddProject' , element: AddProject},
  { path: './views/pages/login/Login', name: 'Login', element: Login},
  { path: '/components/GraphCard', name: 'GraphCard', element: GraphCard},
  { path: './components/GraphContainer.js', name: 'GraphContainer',element: GraphContainer },
  { path: '/dashboard/SuperAdminDashboard', name: 'DashBoard', element: DashBoard},
  { path: '/dashboard/ManageAdmin' , name: "ManageAdmin" , element: ManageAdmin},
  { path: '/dashboard/CreateAdmin', name : "CreateAdmin", element: CreateAdmin },
  { path: '/dashboard/manage_gateway', name : "ManageGateway", element: ManageGateway },
  { path: '/dashboard/manage_projects', name : "ManageProjects", element: ManageProjects },
  { path: '/dashboard/notification', name : "Notification", element: Notification },
  ]

export default routes
