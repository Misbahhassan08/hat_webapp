import { Pencil, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
} from '@mui/material';
import axios from 'axios';
import { Edit, Delete } from '@mui/icons-material';
import urls from '../../urls/urls';

const ManageAdmin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Track the user to delete
  const [admins, setAdmins] = useState([]);

  // ✅ Function to open delete confirmation dialog
  const handleOpenDialog = (userId) => {
    setUserToDelete(userId); // Store the user ID to delete
    setOpenDialog(true); // Open the dialog
  };

  // ✅ Function to close delete confirmation dialog
  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
    setUserToDelete(null); // Reset user to delete
  };



  // Fixed Delete API Call
  const handleConfirmDelete = async () => {
    try {
      // Perform the POST request to delete the user
      await axios.post(`${urls.deleteUser(userToDelete)}`); // Assuming POST is supported at this endpoint

      // Remove the deleted admin from the state list
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== userToDelete));
      setOpenDialog(false); // Close the confirmation dialog
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error);
      alert(`Failed to delete user: ${error.response?.data?.message || 'Server Error'}`);
    }
  };

  const filteredAdmins = admins.filter((admin) =>
    `${admin.firstname} ${admin.lastname} ${admin.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );



  // Fetch the admins on page load
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(urls.adminDetailsSuperAdmin);
        setAdmins(response.data.admins); // Extract the admins array from the response
        console.log("admins data", response.data);

      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };
    fetchAdmins();
    const intervalId = setInterval(fetchAdmins, 5000)
    return () => clearInterval(intervalId)
  }, []);



  const handleEditUser = (user) => {
    console.log("🛠️ handleEditUser called with user:", user);

    if (!user?.id) {
      console.error("❌ No user_id found. Aborting navigation.");
      return;
    }

    // Create user data object
    const userData = { user };

    // Navigate to the edit page with user data in the state
    navigate('/dashboard/CreateAdmin', { state: { userData } });
    console.log("➡️ Navigating to /dashboard/create_admin with user:", user);
  };


  return (
    <div className="w-full">
      <div className="flex justify-between items-center border-b py-3 px-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left Column */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold">Admin</h2>
          <p className="text-gray-600">Managing the Admins</p>
        </div>

        {/* Right Column (Clickable Icon) */}
        <div className="flex-1 text-right">
          <button
            style={{ background: theme.palette.background.create }}
            onClick={() => navigate('/dashboard/CreateAdmin')}
            className="flex items-center gap-2 text-blue-600 cursor-pointer"
          >
            <Plus
              size={40}
              className="hover:scale-110 transition-transform"
              style={{ color: theme.palette.text.TextColor }}
            />
            <p style={{ color: theme.palette.text.TextColor }}>Create Admin</p>
          </button>
        </div>
      </div>
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
        <Typography variant="h5">Admins</Typography>

        {/* Right: Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Search"
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

      {/* Admins Table */}
      <TableContainer
        component={Paper}
        sx={{
          marginTop: 2,
          marginBottom: 2,
          width: '100%',
          overflow: 'auto'
        }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: 'nowrap' }}>
                Sr No.
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                Avatar
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: 'nowrap' }}>
                Name
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: 'nowrap' }}>
                Email
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: 'nowrap' }}>
                Phone Number
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: 'nowrap' }}>
                Address
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: 'nowrap' }}>
                Zip Code
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: 'nowrap' }}>
                Edit
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredAdmins.map((admin, index) => (
              <TableRow key={admin.id}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center">
                    <Avatar
                      src={admin.image || "https://via.placeholder.com/40"}
                      alt={admin.firstname}
                      sx={{ width: 50, height: 50 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {admin.firstname} {admin.lastname}
                </TableCell>
                <TableCell align="center">{admin.email}</TableCell>
                <TableCell align="center">{admin.contact || "-"}</TableCell>
                <TableCell align="center">{admin.address || "-"}</TableCell>
                <TableCell align="center">{admin.zip_code || "-"}</TableCell>
                <TableCell align="center">
                  <Box display="flex" gap={1} justifyContent="center">
                    <IconButton color="primary" onClick={() => handleEditUser(admin)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleOpenDialog(admin.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      {/* Delete Confirmation Dialog */}
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
  );
};

export default ManageAdmin;
