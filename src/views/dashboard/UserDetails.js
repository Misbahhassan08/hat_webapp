import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Avatar,
  Card,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material'
import axios from 'axios'
import urls from '../../urls/urls'
import { List, ListItem, ListItemText, Grid, IconButton } from '@mui/material'
import { ColorModeContext } from '../theme/ThemeContext'
import { centerImage } from 'highcharts'
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import { Edit } from '@mui/icons-material'
import { getUserIdFromLocalStorage } from '../../data/localStorage';
import { Visibility, VisibilityOff } from '@mui/icons-material';




const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


const CreateUser = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState('')
  const [open, setOpen] = React.useState(false);
  const [userGateways, setUserGateways] = useState([]);
  const [openGatewayPop, setOpenGatewayPop] = useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userId = loggedInUser?.user_id;
  const [loading, setLoading] = useState(false);
  const [selectGateway, setSelectGateway] = useState(null);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const theme = useTheme()
  const [contact, setContact] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Fetch user data from API when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${urls.fetchUser}?user_id=${getUserIdFromLocalStorage()}`);
        const user = response.data[0]; // <-- important: get the first user object from array

        console.log('User data from api:', user);

        setFirstname(user.firstname);
        setLastname(user.lastname);
        setRole(user.role);
        setEmail(user.email);
        setImage(user.image);
        setContact(user.contact || '');
        setZipCode(user.zip_code || '');
        setAddress(user.adress || ''); // typo fix: 'adress' not 'address' in your API
        setPassword(user.password || '');

        setFormData({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          contact: user.contact || '',
          role: user.role,
          zip_code: user.zip_code || '',
          address: user.adress || '', // typo fix
          imageBase64: user.image,
          imageBase64: user.password,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [getUserIdFromLocalStorage()]);


  // fetching gateway of user with whole data and empty coms and show in list user gateways list
  const [userListGateways, setUserListGateways] = useState([])
  console.log("Listttt:", userListGateways)
  const fetchGateways = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${urls.userlistGateways}?user_id=${userId}`);
      const data = await response.json();
      setUserListGateways(data.Gateways || []);  // ✅ Extract the array
      console.log("Gateways Data:", data.Gateways);

      if (response.ok) {
        const transformedGateways = data.Gateways.map((item) => {
          let deployStatus = "";
          if (item.deploy_status === "user_aloted") {
            deployStatus = "Alloted to User";
          } else if (item.deploy_status === "warehouse") {
            deployStatus = "In Warehouse";
          } else if (item.deploy_status === "deployed") {
            deployStatus = "Deployed to User";
          }

          return {
            ...item,
            deploy_status: deployStatus,
          };
        });

        setUserGateways(transformedGateways);
      } else {
        setError(data.message || "Failed to fetch gateways");
      }
    } catch (err) {
      setError("Error occurred while fetching data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!userId) return;
    fetchGateways();
  }, [userId]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Fetch Users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(urls.fetchUser)
      console.log('Response data:', response.data)

      const transformedUsers = response.data.map((user) => ({
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
      console.log('Updated Users State (Including Admins):', transformedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }



  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    contact: '',
    password: '',
    role: 'User',  // ✅ Default role
    zip_code: '',
    address: '',
    imageBase64: '',
  })


  const handleEditUser = () => {
    const user_id = getUserIdFromLocalStorage();

    console.log("🛠️ handleEditUser called with user:", user_id);

    if (!user_id) {
      console.error("❌ No user_id found. Aborting API call.");
      return;
    }

    try {
      const userData = {
        user_id,
        firstname,
        lastname,
        email,
        contact,
        password,
        role,
        zip_code: zipCode,
        address,
        image: image,
      };

      navigate('/dashboard/create_user', { state: { userData } });
      console.log("➡️ Navigating to /dashboard/create_user with user:", userData);
    } catch (error) {
      console.error("❌ Error in handleEditUser:", error.message);
    }
  };



  // handleSubmit logic for posting the updated data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get previous form data from state or props
    const previousData = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      contact: formData.contact,
      role: formData.role,
      address: formData.address,
      zip_code: formData.zip_code,
      imageBase64: formData.imageBase64,
    };

    // If the current field is empty, keep the previous value
    const payload = {
      firstname: formData.firstname || previousData.firstname,
      lastname: formData.lastname || previousData.lastname,
      email: formData.email || previousData.email,
      contact: formData.contact || previousData.contact,
      role: formData.role || previousData.role,
      address: formData.address || previousData.address,
      zip_code: formData.zip_code || previousData.zip_code,
      imageBase64: formData.imageBase64 || previousData.imageBase64,
    };

    // Optional validation before submitting the form
    if (!isEditMode) {
      if (!payload.firstname || !payload.lastname || !payload.email || !payload.contact || !payload.address || !payload.zip_code || !payload.imageBase64) {
        alert('All fields are required');
        return;
      }
    }

    try {
      const apiUrl = isEditMode ? urls.updateUser(formData.user_id) : urls.createUser;
      const method = isEditMode ? 'POST' : 'POST';

      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        const createdUserId = result.id || formData.user_id;
        if (!createdUserId) {
          alert('User ID is missing. Cannot assign gateways.');
          return;
        }

        if (selectedGatewaysList.length > 0) {
          const gatewayPayload = {
            user_id: createdUserId,
            gateway_ids: selectedGatewaysList.map(gateway => gateway.G_id),
          };

          const gatewayResponse = await axios.post(assignGateway, gatewayPayload);

          if (gatewayResponse.status === 200) {
            console.log('✅ Gateways assigned successfully');
          } else {
            console.error('❌ Failed to assign gateways', gatewayResponse.data);
            alert('Failed to assign gateways. Please try again.');
          }
        }

        navigate('/dashboard/manage_users');
      } else {
        console.error('❌ API Error:', result);
        alert(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };










  // const [isEditing, setIsEditing] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [unassignedGateway, setUnassignedGateway] = useState([])
  const [selectedGateway, setSelectedGateway] = useState('')
  const [selectedGatewaysList, setSelectedGatewaysList] = useState([])
  console.log("gatewaylist", selectedGatewaysList)
  const [selectedGateways, setSelectedGateways] = useState('')
  const [selectedAssignedGateway, setSelectedAssignedGateway] = useState('')
  const [assignedGateways, setAssignedGateways] = useState([])
  // const isEditMode = !!formData.user_id

  useEffect(() => {
    if (location.state?.user) {
      setFormData(location.state.user)
    }
  }, [location])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRoleChange = (event) => {
    setFormData({ ...formData, role: event.target.value })
  }

  // ✅ Convert Image to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(URL.createObjectURL(file))

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setFormData({ ...formData, imageBase64: reader.result })
      }
    }
  }

  // ✅ Fetch Unassigned Gateways from API

  useEffect(() => {
    const fetchUnassignedGateway = async () => {
      try {
        const response = await axios.get(urls.unassignedGateway)
        console.log('API response:', response.data)

        // ✅ Extract the correct array
        const gatewayData = response.data.UnassignedGateways ?? []

        setUnassignedGateway(gatewayData)
        console.log('Unassigned Gateways:', gatewayData)
      } catch (error) {
        console.error('Error fetching Unassigned Gateways:', error)
        setUnassignedGateway([]) // ✅ Set to an empty array if there's an error
      }
    }
    fetchUnassignedGateway()
    const intervalId = setInterval(fetchUnassignedGateway, 5000)
    return () => clearInterval(intervalId)
  }, [])

  // ✅ Handle Selection of Gateway
  const handleSelectGateway = (gatewayId) => {
    const selectedGatewayObj = unassignedGateway.find((gw) => gw.G_id === gatewayId)

    if (selectedGatewayObj && !selectedGatewaysList.some((gw) => gw.G_id === gatewayId)) {
      setSelectedGatewaysList([...selectedGatewaysList, selectedGatewayObj]) // ✅ Add selected gateway
    }
  }



  //////////////////////////////////////////////////////////////////////////

  // const receivedUser = location.state?.user
  // console.log('receivedUSerDarta:', receivedUser)
  const userData = location.state?.userData || {}
  const receivedUser = userData && userData.user ? userData : { user: {} }
  const assignGateway = urls.assignGateway
  const isEditMode = receivedUser.user?.id !== undefined

  console.log("Received user:", receivedUser)

  const gateways = userData?.userGateways || []

  useEffect(() => {
    const user = receivedUser.user || {}

    if (user.id) {
      console.log('✅ Edit Mode: User ID detected:', user.id)

      setFormData({
        user_id: user.id,
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        contact: user.contact || '',
        password: '',
        role: user.role || '',
        zip_code: user.zip_code || '',
        adress: user.adress || '',
        imageBase64: user.image || '',
        hardware: user.hardware || [],
      })

      if (user.gateways) {
        setAssignedGateways(user.gateways)
      }

    } else {
      console.log('❌ Edit Mode: No User ID detected. Switching to Create Mode.')
    }
  }, [location.state])






  return (
    <Box sx={{ padding: { xs: 2, sm: 3 } }}>
<Box
  sx={{
    background: theme.palette.background.paper,
    p: { xs: 2, sm: 3, md: 4 },
    borderRadius: { xs: '8px', sm: '12px' },
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid',
    borderColor: 'divider',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: { xs: 2, sm: 3 }
  }}
>
  {/* Header with Edit Button */}
  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
    <Typography 
      variant="h5" 
      fontWeight="bold"
      sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
    >
      User Profile
    </Typography>
    {/* Uncomment if you need edit button */}
    {/* <Button 
      size="small" 
      variant="outlined" 
      onClick={handleEditUser}
      startIcon={<Edit fontSize="small" />}
      sx={{ minWidth: 'auto' }}
    >
      Edit
    </Button> */}
  </Box>

  <Box display="flex" flexDirection={{ xs: 'column', lg: 'row' }} gap={{ xs: 3, lg: 4 }}>
    
    {/* Profile Card */}
    <Box 
      sx={{ 
        flex: { xs: '1 1 auto', lg: '0 0 350px' },
        background: theme.palette.background.default,
        borderRadius: '12px',
        p: { xs: 2, sm: 3 },
        border: '1px solid',
        borderColor: 'divider',
        alignSelf: 'flex-start'
      }}
    >
      {/* Avatar Section */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        {image && (
          <Avatar
            src={image}
            sx={{ 
              width: { xs: 100, sm: 120, md: 140 },
              height: { xs: 100, sm: 120, md: 140 },
              mb: 2,
              border: '3px solid',
              borderColor: 'primary.main'
            }}
          />
        )}
        
        {(firstname || lastname) && (
          <Typography 
            variant="h6" 
            fontWeight="bold"
            textAlign="center"
            sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
          >
            {firstname} {lastname}
          </Typography>
        )}
      </Box>

      {/* Profile Details */}
      <Box display="flex" flexDirection="column" gap={2}>
        {email && (
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
            <Typography fontWeight="bold" minWidth={80} fontSize="0.9rem">
              Email:
            </Typography>
            <Typography fontSize="0.9rem" color="text.secondary">
              {email}
            </Typography>
          </Box>
        )}

        {contact && (
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
            <Typography fontWeight="bold" minWidth={80} fontSize="0.9rem">
              Phone:
            </Typography>
            <Typography fontSize="0.9rem" color="text.secondary">
              {contact}
            </Typography>
          </Box>
        )}

        {role && (
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
            <Typography fontWeight="bold" minWidth={80} fontSize="0.9rem">
              Role:
            </Typography>
            <Chip 
              label={role} 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ alignSelf: 'flex-start' }}
            />
          </Box>
        )}

        {zipCode && (
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
            <Typography fontWeight="bold" minWidth={80} fontSize="0.9rem">
              Zip Code:
            </Typography>
            <Typography fontSize="0.9rem" color="text.secondary">
              {zipCode}
            </Typography>
          </Box>
        )}

        {address && (
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
            <Typography fontWeight="bold" minWidth={80} fontSize="0.9rem">
              Address:
            </Typography>
            <Typography fontSize="0.9rem" color="text.secondary" flex={1}>
              {address}
            </Typography>
          </Box>
        )}

        {password && (
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="flex-start" gap={1}>
            <Typography fontWeight="bold" minWidth={80} fontSize="0.9rem">
              Password:
            </Typography>
            <Box display="flex" alignItems="center" gap={1} flex={1}>
              <Typography fontSize="0.9rem" color="text.secondary">
                {showPassword ? password : '••••••••'}
              </Typography>
              <IconButton 
                onClick={toggleVisibility} 
                size="small"
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
    </Box>

    {/* Divider - Hidden on mobile */}
    <Divider 
      orientation="vertical" 
      flexItem 
      sx={{ 
        display: { xs: 'none', lg: 'block' },
        my: 1
      }} 
    />
    <Divider 
      orientation="horizontal" 
      flexItem 
      sx={{ 
        display: { xs: 'block', lg: 'none' },
        mx: 1
      }} 
    />

    {/* Gateways Section */}
    <Box 
      sx={{ 
        flex: 1,
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography 
        fontWeight="bold" 
        variant="h6"
        sx={{ 
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          mb: 2
        }}
      >
        Assigned Gateways
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress size={32} />
        </Box>
      ) : userListGateways.length > 0 ? (
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '12px',
            overflow: 'hidden',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <List
            sx={{
              flex: 1,
              overflowY: 'auto',
              maxHeight: { xs: 300, sm: 400, md: 500 },
              p: 1
            }}
          >
            {userListGateways.map((gateway) => (
              <ListItem
                key={gateway.G_id}
                sx={{
                  cursor: gateway.deploy_status === "Deployed to User" ? "not-allowed" : "pointer",
                  backgroundColor: selectGateway?.G_id === gateway.G_id
                    ? "primary.main"
                    : theme.palette.background.paper,
                  color: selectGateway?.G_id === gateway.G_id ? "white" : "text.primary",
                  borderRadius: '8px',
                  bgcolor: "#cecdcdff",
                  padding: { xs: 1.5, sm: 2 },
                  marginBottom: 1,
                  opacity: gateway.deploy_status === "Deployed to User" ? 0.6 : 1,
                  pointerEvents: gateway.deploy_status === "Deployed to User" ? "none" : "auto",
                  transition: 'all 0.2s ease-in-out',
                  border: '1px solid',
                  borderColor: selectGateway?.G_id === gateway.G_id ? 'primary.main' : 'transparent',
                  "&:hover": gateway.deploy_status !== "Deployed to User"
                    ? { 
                        backgroundColor: "primary.main",
                        color: "white",
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }
                    : {},
                }}
              >
                <ListItemText
                  primary={
                    <Typography 
                      fontWeight="medium"
                      sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                    >
                      {gateway.G_id} - {gateway.gateway_name}
                    </Typography>
                  }
                  secondary={
                    <Typography 
                      variant="body2"
                      sx={{ 
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        opacity: selectGateway?.G_id === gateway.G_id ? 0.8 : 0.7,
                        mt: 0.5
                      }}
                    >
                      MAC: {gateway.mac_address} • Status: {gateway.deploy_status}
                    </Typography>
                  }
                />
                {gateway.deploy_status === "Deployed to User" && (
                  <Chip 
                    label="Deployed" 
                    size="small" 
                    color="default"
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          flex={1}
          sx={{ 
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: '12px',
            background: theme.palette.background.default,
            minHeight: 120
          }}
        >
          <Typography color="text.secondary" textAlign="center">
            No gateways assigned
          </Typography>
        </Box>
      )}
    </Box>
  </Box>
</Box>

      {/* Dialog Box for Editing Details */}
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md" // Sets the dialog width to 'md'
        fullWidth >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Update Details
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ maxWidth: 800, margin: 'auto', padding: 4 }}>
          <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 3 }}>
            {isEditMode ? 'Edit User' : 'Create User'}
            {/* Create User */}
          </Typography>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  fullWidth
                  placeholder="First Name"
                />
                <TextField
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Last Name"
                />
                <TextField
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Email"
                />
                <TextField
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Phone Number"
                />
                <TextField
                  name="adress"
                  value={formData.adress}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Address"
                />
                <TextField
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Zip Code"
                />

                {/* <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select name="role" value={formData.role} onChange={handleRoleChange}>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl> */}

                <TextField
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Password"
                  type="password"
                />
              </Box>
              <Button variant="contained" color="primary" sx={{ marginTop: 3 }} onClick={handleSubmit}>
                {isEditMode ? 'Update User' : 'Create User'}
              </Button>
            </Box>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Preview"
                  style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    background: theme.palette.background.paper,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    border: '2px dashed #ccc',
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    No Image Selected
                  </Typography>
                </Box>
              )}
              <Button
                variant="contained"
                component="label"
                sx={{ marginTop: 2, display: 'block', width: '100%' }}
              >
                Upload Image
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </Button>

            </Box>
          </Box>


        </Box>

        <DialogActions>
          {/* <Button autoFocus variant='outlined' onClick={handleSubmit}>Save</Button>   */}
        </DialogActions>
      </BootstrapDialog>
    </Box>
  )
}

export default CreateUser
