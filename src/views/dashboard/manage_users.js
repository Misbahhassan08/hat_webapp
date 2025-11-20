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
  Avatar,
} from '@mui/material'
import { ColorModeContext } from '../theme/ThemeContext'
import { getUserIdFromLocalStorage } from '../../data/localStorage';


const ManageUsers = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const loggedInUserRole = localStorage.getItem("role");
  console.log("role", loggedInUserRole)
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
        const loggedInUserRole = localStorage.getItem("role");
        const loggedInUserId = localStorage.getItem("user_id");

        const response = await axios.get(urls.fetchUser);
        console.log("Response data:", response.data);

        let filteredData = response.data;

        // ✅ Only show users (not admin or superadmin)
        filteredData = filteredData.filter(user => user.role === "user");

        // ✅ Superadmin logic
        if (loggedInUserRole === "superadmin") {
          const adminIds = response.data
            .filter(u => u.role === "admin")
            .map(u => String(u.user_id));

          filteredData = filteredData.filter(
            user => adminIds.includes(String(user.created_by_id))
          );
        }

        // ✅ Admin logic
        if (loggedInUserRole === "admin") {
          filteredData = filteredData.filter(
            user => String(user.created_by_id) === String(loggedInUserId)
          );
        }

        const transformedUsers = filteredData.map(user => ({
          id: user.user_id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          contact: user.contact,
          address: user.adress,
          zip_code: user.zip_code,
          role: user.role,
          image: user.image,
        }));

        setUsers(transformedUsers);
        console.log("Filtered Users Final:", transformedUsers);

      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
    const intervalId = setInterval(fetchUsers, 5000);
    return () => clearInterval(intervalId);
  }, []);




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

  const handleOpenDialog = (userId) => {
    console.log("🗑️ Opening delete dialog for user:", userId);
    setUserToDelete(userId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) {
      console.warn("⚠️ No user selected for deletion.");
      return;
    }

    console.log("📡 Sending delete request for user ID:", userToDelete);

    try {
      const response = await axios.post(`${urls.deleteUser(userToDelete)}`);
      console.log(" Delete API Response:", response.data);

      // Remove the deleted user from UI
      setUsers((prevUsers) =>
        prevUsers.filter((user) => String(user.id) !== String(userToDelete))
      );

      // Close dialog
      setOpenDialog(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("❌ Error deleting user:", error.response?.data || error);
      alert(
        `Failed to delete user: ${error.response?.data?.message || "Server Error"
        }`
      );
    }
  };


  const handleEditUser = async (user) => {
    console.log("🛠️ handleEditUser called with user:", user);

    if (!user?.id) {
      console.error("❌ No user_id found. Aborting API call.");
      return;
    }

    try {
      console.log("📡 Fetching user gateways from:", `${urls.userGateways}?user_id=${user.id}`);
      const response = await axios.get(`${urls.userGateways}?user_id=${user.id}`);
      console.log("✅ API Response:", response.data);
      const userGateways = response.data.Gateways

      const userData = { user, userGateways }

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
          <h2 className="text-lg font-semibold">Customers</h2>
          <p className="text-gray-600">Managing the Customers</p>
        </div>

        {/* Right Column (Clickable Icon) */}
        <div className="flex-1 text-right">
          {loggedInUserRole === "admin" && (
            <button
              style={{ background: theme.palette.background.create }}
              onClick={handleIconClick}
              className="flex items-center gap-2 text-blue-600 cursor-pointer"
            >
              <Plus size={40} className="hover:scale-110 transition-transform" style={{ color: theme.palette.text.TextColor }} />
              <p style={{ color: theme.palette.text.TextColor }}>Create Customer</p>
            </button>
          )}

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
          <Typography variant="h5">Customer Data Table</Typography>


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
            <TableContainer
              component={Paper}
              sx={{
                marginTop: 2,
                width: '100%',
                overflow: 'auto' // Adds horizontal scroll on small screens
              }}
            >
              <Table sx={{ minWidth: 650 }}> {/* Minimum width for better responsiveness */}
                <TableHead>
                  <TableRow sx={{ background: theme.palette.background.paper }}>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    >
                      Sr No
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    >
                      Avatar
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    >
                      First Name
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    >
                      Last Name
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    >
                      Contact
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    >
                      Access Level
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <TableRow key={user.id || index}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">
                          <Box display="flex" justifyContent="center">
                            <Avatar
                              src={user.image || "https://via.placeholder.com/40"}
                              alt={user.firstname}
                              sx={{ width: 50, height: 50 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center">{user.firstname}</TableCell>
                        <TableCell align="center">{user.lastname}</TableCell>
                        <TableCell align="center">{user.email}</TableCell>
                        <TableCell align="center">{user.contact}</TableCell>
                        <TableCell align="center">
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={1} justifyContent="center">
                            <IconButton color="primary" onClick={() => handleEditUser(user)}>
                              <Edit />
                            </IconButton>
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
