import React, { useContext, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { DarkMode, LightMode, ExitToApp } from '@mui/icons-material'
import { IconButton, useTheme } from '@mui/material'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'
import { motion } from 'framer-motion'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { ColorModeContext } from '../views/theme/ThemeContext'
import { useNavigate } from 'react-router-dom'
import urls from '../urls/urls'


const AppHeader = () => {
  const theme = useTheme()
  const headerRef = useRef()
  // const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const colorMode = useContext(ColorModeContext)
  const isDarkMode = theme.palette.mode === 'dark'
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false)
  const navigate = useNavigate()


  const user = JSON.parse(localStorage.getItem('user'))
  // console.log ("data......",user.firstname)

  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true)
  }

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false)
  }

  const handleLogout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;

      if (!email) {
        console.warn("⚠️ No email found in localStorage — cannot logout properly");
        return;
      }

      console.log("📤 Sending logout request to:", urls.logout);
      console.log("📧 Logging out user with email:", email);

      const response = await axios.post(
        urls.logout,
        { email: email }, 
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(" Logout API Response:", response.data);

      if (response.data.success) {
        // Clear local storage and navigate to login
        localStorage.removeItem("authToken");
        localStorage.removeItem("selectedGateways");
        localStorage.removeItem("user");
        localStorage.removeItem("selectedProjectId");
        localStorage.removeItem("selectedGatewayId");
        navigate("/login");
      } else {
        console.warn("⚠️ Logout API returned false:", response.data);
      }
    } catch (error) {
      console.error("❌ Logout failed:", error);
      if (error.response) {
        console.error("🔍 Error response from server:", error.response.data);
      }
    }
  };


  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader
      position="sticky"
      className="mb-4 p-0"
      ref={headerRef}
      style={{ background: theme.palette.background.paper }}
    >
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" style={{ color: theme.palette.text.TextColor }} />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink
              to="/dashboard"
              as={NavLink}
              style={{ color: theme.palette.text.TextColor, fontSize: '0.8rem' }}
            >
              {`Welcome ${user.firstname} ${user.lastname} `}
              {/* {`Welcome ${user.firstname} ${user.lastname} (${user.role})`} */}
            </CNavLink>

          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" style={{ color: theme.palette.text.TextColor }} />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          {/* Theme Toggle Button */}
          <IconButton onClick={colorMode.toggleColorMode}>
            {isDarkMode ? (
              <LightMode sx={{ color: theme.palette.text.primary }} />
            ) : (
              <DarkMode sx={{ color: theme.palette.text.TextColor }} />
            )}
          </IconButton>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          {/* ✅ Logout Button Added Below */}
          <IconButton onClick={handleOpenLogoutDialog}>
            <ExitToApp sx={{ color: theme.palette.text.TextColor, fontSize: 30 }} />
          </IconButton>
        </CHeaderNav>
      </CContainer>
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        PaperComponent={(props) => (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          >
            <div
              {...props}
              style={{
                borderRadius: '12px',
                padding: '10px',
                boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
                background: theme.palette.background.default
              }}
            >
              {props.children}
            </div>
          </motion.div>
        )}
      >
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>Logout</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', fontSize: '16px', color: theme.palette.text.TextColor }}>
          Are you sure you want to logout?
        </DialogContent>
        <DialogActions
          sx={{ display: 'flex', justifyContent: 'center', gap: 2, paddingBottom: '15px' }}
        >
          <Button
            onClick={handleCloseLogoutDialog}
            sx={{
              backgroundColor: '#bbb',
              color: '#fff',
              '&:hover': { backgroundColor: '#999' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            sx={{
              backgroundColor: '#d32f2f',
              color: '#fff',
              '&:hover': { backgroundColor: '#b71c1c' },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </CHeader>
  )
}

export default AppHeader
{
  /* <AppHeaderDropdown /> */
}
