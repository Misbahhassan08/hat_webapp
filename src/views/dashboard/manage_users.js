import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Plus } from 'lucide-react'
import { Edit, Delete } from '@mui/icons-material'
import urls from '../../urls/urls'
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  useTheme,
  backdropClasses,
} from '@mui/material'
import { ColorModeContext } from '../theme/ThemeContext'
import { getUserIdFromLocalStorage } from '../../data/localStorage';


const ManageUsers = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  // console.log ("usersdata",users)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const theme = useTheme()

  // Fetch Users from API

  
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const loggedInUserId = localStorage.getItem('user_id') // Get user_id from localStorage
    
        const response = await axios.get(urls.fetchUser)
        console.log('Response data:', response.data)
    
        // Filter users: only show users with role "user" AND created_by = loggedInUserId
        const transformedUsers = response.data
          .filter(user => user.role === 'user' && String(user.created_by_id) === String(getUserIdFromLocalStorage()))
          .map((user) => ({
            id: user.user_id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            contact: user.contact,
            address: user.adress,
            zip_code: user.zip_code,
            role: user.role,
            image: user.image 
          }))
    
        setUsers(transformedUsers)
        console.log('Filtered Users (Only users created by this admin):', transformedUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
    const intervalId = setInterval(fetchUsers, 5000)
    return () => clearInterval(intervalId)
  }, [])


  const handleIconClick = () => {
    navigate('/Dashboard/create_user')
  }

  //  Function to handle individual checkbox selection
  const handleSelectUser = (id) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id],
    )
  }

  
  //  Function to handle "Select All" checkbox
  const handleSelectAll = () => {
    setSelectedUsers(selectedUsers.length === users.length ? [] : users.map((user) => user.id))
  }

  // ✅ Function to open delete confirmation dialog
  const handleOpenDialog = (userId) => {
    setUserToDelete(userId)
    setOpenDialog(true)
  }

  // ✅ Function to close delete confirmation dialog
  const handleCloseDialog = () => {
    setOpenDialog(false)
    setUserToDelete(null)
  }

  // Fixed Delete API Call
  const handleConfirmDelete = async () => {
    try {
      await axios.post(`${urls.deleteUser(userToDelete)}`)
      setUsers((prevUsers) => prevUsers.filter((user) => String(user.id) !== String(userToDelete)))
      setOpenDialog(false)
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error)
      alert(`Failed to delete user: ${error.response?.data?.message || 'Server Error'}`)
    }
  }

  const handleEditUser = async (user) => {
    console.log("🛠️ handleEditUser called with user:",user);
  
    if (!user?.id) {
      console.error("❌ No user_id found. Aborting API call.");
      return;
    }
  
    try {
      console.log("📡 Fetching user gateways from:", `${urls.userGateways}?user_id=${user.id}`);
      const response = await axios.get(`${urls.userGateways}?user_id=${user.id}`);
      console.log("✅ API Response:", response.data);
      const userGateways = response.data.Gateways

      const userData = {user , userGateways }
  
      // Navigate only if API call succeeds
      navigate('/dashboard/create_user', { state: { userData } });
      console.log("➡️ Navigating to /dashboard/create_user with user:", user);
    } catch (error) {
      console.error("❌ Error fetching Gateways:", error.response ? error.response.data : error.message);
    }
  };
  

  return (
    <div className="w-full">
      {/* Row Layout */}
      <div
        className="flex justify-between items-center border-b py-3 px-4"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        {/* Left Column */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-gray-600">Managing the Users</p>
        </div>

        {/* Right Column (Clickable Icon) */}
        <div className="flex-1 text-right">
          <button
          style={{background: theme.palette.background.create}}
            onClick={handleIconClick}
            className="flex items-center gap-2 text-blue-600 cursor-pointer"
          >
            <Plus size={40} className="hover:scale-110 transition-transform" style={{color:theme.palette.text.TextColor}}/>
            <p  style={{color:theme.palette.text.TextColor}}>Create User</p>
          </button>
        </div>
      </div>

      <Box sx={{ padding: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
            background: 'linear-gradient(135deg, rgb(103, 182, 247), rgb(50, 120, 185))',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          {/* Left: Heading */}
          <Typography variant="h5">User Data Table</Typography>


          {/* Right: Search Bar */}
          <TextField
            variant="outlined"
            placeholder="Search"
            size="small"
            sx={{ width: '250px', background: theme.palette.background.paper, border: 'none', borderRadius: "4px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        {/* ✅ Sorting Logic - Matches Appear on Top */}
        {(() => {
          const lowerSearchTerm = searchTerm.toLowerCase()

          //code
          const filteredUsers = users.filter((user) => {
            return (
              user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.contact.toLowerCase().includes(searchTerm.toLowerCase())
            );
          });
          

     
          
          return (
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: theme.palette.background.paper }}>
                   
                    <TableCell style={{ fontWeight: 'bold' }}>Sr No</TableCell>

                    <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>First Name</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Last Name</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Contact</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Access Level</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <TableRow key={user.id || index}>
                        {/* Individual Checkbox */}
                        
                        <TableCell>{index +1}</TableCell>

                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.firstname}</TableCell>
                        <TableCell>{user.lastname}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.contact}</TableCell>
                        <TableCell>{user.role === 'admin' ? 'Admin'  : 'User'}</TableCell>

                        <TableCell>
                          <Box display="flex" gap={1}>
                            <IconButton color="primary" onClick={() => handleEditUser(user)}>  
                              <Edit />
                            </IconButton>
                            {/* ✅ Updated Delete Icon to Open Dialog */}
                            <IconButton color="error" onClick={() => handleOpenDialog(user.id)}>
                              <Delete />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )
        })()}
      </Box>

      {/* ✅ Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ManageUsers
