import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  useTheme,
  List,
  ListItem,
  ListItemText, FormControl, InputLabel,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

import urls from '../../urls/urls';

const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPhoneValid = (phone) => /^[0-9]{4}-[0-9]{7}$/.test(phone);
const isZipCodeValid = (zip) => /^[0-9]{4,10}$/.test(zip);


const CreateUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [errors, setErrors] = useState({});


  const userData = location.state?.userData || {};
  const receivedUser = userData?.user || {};
  const loggedInUserId = userData?.user_id; // ID of the admin creating a user
  const isEditMode = receivedUser?.id !== undefined;
  const userId = receivedUser?.id;
  const handleRoleChange = (event) => {
    setFormData({ ...formData, role: event.target.value })
  }

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    contact: '',
    password: '',
    role: 'admin',
    zip_code: '',
    adress: '',
    image: '',
    is_online: false,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // for new uploads
  const [unassignedGateway, setUnassignedGateway] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState('');
  const [selectedGatewaysList, setSelectedGatewaysList] = useState([]);
  const [assignedGateways, setAssignedGateways] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        firstname: receivedUser.firstname || '',
        lastname: receivedUser.lastname || '',
        email: receivedUser.email || '',
        contact: receivedUser.contact || '',
        password: '',
        role: receivedUser.role || 'admin',
        zip_code: receivedUser.zip_code || '',
        adress: receivedUser.address || '',
        image: receivedUser.image || '',
        is_online: receivedUser.is_online || false,
      });
      setSelectedImage(receivedUser.image);
      if (receivedUser.gateways) {
        setAssignedGateways(receivedUser.gateways);
      }
    }
  }, [location.state]);

  useEffect(() => {
    const fetchUnassignedGateway = async () => {
      try {
        const response = await axios.get(urls.unassignedGateway);
        setUnassignedGateway(response.data.UnassignedGateways ?? []);
      } catch (error) {
        console.error('Error fetching Unassigned Gateways:', error);
        setUnassignedGateway([]);
      }
    };
    fetchUnassignedGateway();
    const intervalId = setInterval(fetchUnassignedGateway, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'contact') {
      // Remove non-numeric characters except dash
      let cleaned = value.replace(/[^\d]/g, '');
  
      // Limit to 11 digits
      if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
  
      // Add dash after 4 digits if at least 5 digits are entered
      if (cleaned.length > 4) {
        cleaned = cleaned.slice(0, 4) + '-' + cleaned.slice(4);
      }
  
      setFormData({ ...formData, [name]: cleaned });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const preview = URL.createObjectURL(file);
    setSelectedImage(preview);
  };

  const handleSelectGateway = (gatewayId) => {
    const selected = unassignedGateway.find((g) => g.G_id === gatewayId);
    if (selected && !selectedGatewaysList.find((g) => g.G_id === gatewayId)) {
      setSelectedGatewaysList((prev) => [...prev, selected]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const newErrors = {};
  
    if (!formData.firstname) newErrors.firstname = "First name is required";
    if (!formData.lastname) newErrors.lastname = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.contact) newErrors.contact = "Phone number is required";
    if (!formData.password && !isEditMode) newErrors.password = "Password is required";
  
    if (formData.contact && !isPhoneValid(formData.contact)) {
      newErrors.contact = "Phone number must be exactly 11 digits";
    }

  
            
    
  
    if (!isEmailValid(formData.email)) {
      newErrors.email = "Invalid email format";
    }
  
    if (!isPhoneValid(formData.contact)) {
      newErrors.contact = "Invalid phone number";
    }
  
  

  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
  
    setErrors({}); // Clear previous errors if valid
  
    try {
      let imageUrl = formData.image;
      if (selectedFile) {
        const timestamp = new Date().getTime();
        const randomNumber = Math.floor(Math.random() * 10000);
        const uniqueFilename = `image_${timestamp}_${randomNumber}.png`;
  
        const uploadForm = new FormData();
        uploadForm.append('image', selectedFile, uniqueFilename);
        const uploadResponse = await axios.post('https://mexemai.com/bucket/update/ems', uploadForm);
        imageUrl = uploadResponse.data.image_url;
      }
  
      const payload = {
        ...formData,
        ...(imageUrl ? { image: imageUrl } : {}),
        password: isEditMode ? undefined : formData.password,
      };
  
      const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined && v !== '')
      );
      
  
      const apiUrl = isEditMode ? urls.updateUser(userId) : urls.createUser;
      const method = 'POST';
  
      const response = await fetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedPayload),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        alert(isEditMode ? 'Admin updated successfully' : 'Admin created successfully');
        navigate('/dashboard/manageAdmin');
      } else {
        alert(responseData?.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error creating/updating user:', error);
      alert('An error occurred while creating/updating the user');
    } finally {
      setLoading(false);
    }
  };
  




  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {isEditMode ? 'Edit Admin' : 'Create Admin'}
      </Typography>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1 }}>
        <TextField
  name="firstname"
  label="First Name *"
  value={formData.firstname}
  onChange={handleChange}
  fullWidth
  sx={{ mb: 2 }}
  error={!!errors.firstname}
  helperText={errors.firstname}
/>

<TextField
  name="lastname"
  label="Last Name *"
  value={formData.lastname}
  onChange={handleChange}
  fullWidth
  sx={{ mb: 2 }}
  error={!!errors.lastname}
  helperText={errors.lastname}
/>

<TextField
  name="email"
  label="Email *"
  value={formData.email}
  onChange={handleChange}
  fullWidth
  sx={{ mb: 2 }}
  error={!!errors.email}
  helperText={errors.email}
/>

<TextField
  name="contact"
  label="Phone Number *"
  value={formData.contact}
  onChange={handleChange}
  fullWidth
  sx={{ mb: 2 }}
  error={!!errors.contact}
  helperText={errors.contact}
/>

    
    <TextField
      name="adress"
      label="Address"
      value={formData.adress}
      onChange={handleChange}
      fullWidth
      sx={{ mb: 2 }}
      error={!!errors.adress}
      helperText={errors.adress}
    />
    
    
              <TextField
      name="zip_code"
      label="Zip code"
      value={formData.zip_code}
      onChange={handleChange}
      fullWidth
      sx={{ mb: 2 }}
      error={!!errors.zip_code}
      helperText={errors.zip_code}
    />



{!isEditMode && (
  <TextField
            name="password"
        label="Password *"
    value={formData.password}
    onChange={handleChange}
    fullWidth
    type="password"
    sx={{ mb: 2 }}
    error={!!errors.password}
    helperText={errors.password}
  />
)}
          

          <Button variant="contained" onClick={handleSubmit}  fullWidth disabled={loading}>
            {loading ? 'Saving...' : isEditMode ? 'Update Admin' : 'Create Admin'}
          </Button>
        </Box>

        <Box sx={{ flex: 1 }}>
  {selectedImage || formData.image ? (
    <img src={selectedImage || formData.image} alt="Uploaded" style={{ width: '100%', borderRadius: 8 }} />
  ) : (
    <Box
      sx={{
        width: '100%',
        height: 200,
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        border: '2px dashed #ccc',
      }}
    >
      <Typography>No Image Selected</Typography>
    </Box>
  )}

  {errors.image && (
    <Typography sx={{ color: 'red', mt: 1 }} variant="body2">
      {errors.image}
    </Typography>
  )}

  <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
    Upload Image
    <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
  </Button>
</Box>

      </Box>

    
    </Box>
  );
};

export default CreateUser;
