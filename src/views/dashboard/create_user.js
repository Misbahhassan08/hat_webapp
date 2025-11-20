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
  ListItemText,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getUserIdFromLocalStorage } from '../../data/localStorage';
import urls from '../../urls/urls';


const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPhoneValid = (phone) => /^[0-9]{4}-[0-9]{7}$/.test(phone);
const isZipCodeValid = (zip) => /^[0-9]{4,10}$/.test(zip);

const CreateUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const userData = location.state?.userData || {};
  const receivedUser = userData?.user || {};
  const loggedInUserId = userData?.user_id; // ID of the admin creating a user
  const isEditMode = receivedUser?.id !== undefined;
  const userId = receivedUser?.id;
  const gateways = userData?.userGateways || []
  const assignGateway = urls.assignGateway
  const [role, setRole] = useState('');
  const [image, setImage] = useState("");
  console.log("uploaded image", image);




  useEffect(() => {
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setRole(user.role || ''); // Set role from localStorage
    }
  }, []);


  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    contact: '',
    password: '',
    role: 'user',
    zip_code: '',
    adress: '',
    image: '',
    is_online: false,
    user_id: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // for new uploads
  const [unassignedGateway, setUnassignedGateway] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState('');
  const [selectedGatewaysList, setSelectedGatewaysList] = useState([]);
  const [assignedGateways, setAssignedGateways] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    if (isEditMode) {
      setFormData({
        firstname: receivedUser.firstname || '',
        lastname: receivedUser.lastname || '',
        email: receivedUser.email || '',
        contact: receivedUser.contact || '',
        password: receivedUser.password || '',
        role: receivedUser.role || 'user',
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
        const userId = localStorage.getItem('user_id'); // Or use getUserIdFromLocalStorage()
        const response = await axios.get(urls.unassignedGateway);

        // Filter gateways by created_by_id
        const filteredGateways = (response.data.UnassignedGateways ?? []).filter(
          (gateway) => String(gateway.created_by_id) === String(getUserIdFromLocalStorage())
        );

        setUnassignedGateway(filteredGateways);
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

  // 🖼️ Handle upload OR update
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setSelectedImage(preview);

    try {
      let response;

      // Extract public_id if editing existing user
      const match = formData.image?.match(/upload\/(.*?)\./);
      const publicId = match ? `uploads/${match[1]}` : null;

      if (isEditMode && publicId) {
        console.log("🪶 Updating existing image with public_id:", publicId);
        const formDataObj = new FormData();
        formDataObj.append("public_id", publicId);
        formDataObj.append("image", file);

        response = await axios.post(urls.updateImage, formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        console.log("🆕 Uploading new image...");
        const formDataObj = new FormData();
        formDataObj.append("image", file);

        response = await axios.post(urls.uploadImage, formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      console.log("🖼️ Image Upload/Update Response:", response.data);

      const newImageUrl =
        response.data?.url ||
        response.data?.result?.secure_url ||
        response.data?.result?.url;

      if (newImageUrl) {
        setImage(newImageUrl);
        setFormData((prev) => ({
          ...prev,
          image: newImageUrl,
        }));
      }
    } catch (error) {
      console.error("❌ Error uploading/updating image:", error.response?.data || error);
    }
  };

  // 🗑️ Handle delete
  const handleDeleteImage = async () => {
    if (!formData.image) return;

    const match = formData.image.match(/upload\/(.*?)\./);
    const publicId = match ? `uploads/${match[1]}` : null;
    if (!publicId) {
      console.warn("⚠️ Could not extract public_id from image URL");
      return;
    }

    try {
      const res = await axios.post(urls.deleteImage, {
        public_ids: [publicId],
      });
      console.log("🗑️ Image deleted:", res.data);

      // Clear image from UI
      setFormData((prev) => ({ ...prev, image: "" }));
      setSelectedImage(null);
      setImage("");
    } catch (err) {
      console.error("❌ Error deleting image:", err.response?.data || err);
    }
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      const finalImage = image || formData.image;

      const createdById = getUserIdFromLocalStorage();

      const userPayload = {
        ...formData,
        image: finalImage,
        password: isEditMode ? undefined : formData.password,
        created_by_id: createdById,
      };

      const cleanedUserPayload = Object.fromEntries(
        Object.entries(userPayload).filter(([_, v]) => v !== undefined && v !== "" && v !== null)
      );

      console.log("🧾 FULL FORM DATA:", formData);
      console.log("🖼️ Final Image URL:", finalImage);
      console.log("🧹 Cleaned Payload:", cleanedUserPayload);

      const apiUrl = isEditMode ? urls.updateUser(userId) : urls.createUser;
      const method = "POST";

      // ✅ Send user creation/update request
      const response = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedUserPayload),
      });

      const responseData = await response.json();

      if (response.ok) {
        const createdUserId = responseData.id || userId;

        if (!createdUserId) {
          alert("User ID is missing. Cannot assign gateways.");
          return;
        }

        // ✅ Assign selected gateways (only if any selected)
        if (selectedGatewaysList.length > 0) {
          const gatewayPayload = {
            user_id: createdUserId,
            gateway_ids: selectedGatewaysList.map((gw) => gw.G_id),
          };

          console.log("📡 Gateway Assignment Payload:", gatewayPayload);

          const gatewayResponse = await axios.post(assignGateway, gatewayPayload);

          if (gatewayResponse.status === 200) {
            console.log("✅ Gateways assigned successfully");
          } else {
            console.error("❌ Failed to assign gateways", gatewayResponse.data);
            alert("Failed to assign gateways. Please try again.");
          }
        }

        alert(isEditMode ? "User updated successfully" : "User created successfully");
        navigate("/dashboard/manage_users");
      } else {
        alert(responseData?.message || "An error occurred");
      }
    } catch (error) {
      console.error("❌ Error creating/updating user:", error);
      alert("An error occurred while creating/updating the user");
    } finally {
      setLoading(false);
    }
  };





  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {isEditMode ? 'Edit User' : 'Create User'}
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


          <Button variant="contained" onClick={handleSubmit} fullWidth disabled={loading}>
            {loading ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
          </Button>
        </Box>

        <Box sx={{ flex: 1 }}>
          {selectedImage || formData.image ? (
            <Box sx={{ position: "relative", display: "inline-block", width: "100%" }}>
              <img
                src={selectedImage || formData.image}
                alt="Uploaded"
                style={{
                  width: "100%",
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />

              {/* ❌ Cross icon for delete */}
              <Box
                onClick={handleDeleteImage}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": { backgroundColor: "rgba(255,0,0,0.8)", color: "white" },
                }}
              >
                ✕
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: 200,
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                border: "2px dashed #ccc",
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
          {role === 'admin' && <Select
            value={selectedGateway}
            onChange={(e) => {
              setSelectedGateway(e.target.value);
              handleSelectGateway(e.target.value);
            }}
            fullWidth
            displayEmpty
            sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>Select an Unassigned Gateway</MenuItem>
            {unassignedGateway.map((gw) => (
              <MenuItem key={gw.G_id} value={gw.G_id}>
                {gw.gateway_name}
              </MenuItem>
            ))}
          </Select>}


        </Box>

      </Box>

      {role === 'admin' && <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            Assigned Gateways
          </Typography>
          <List
            sx={{ border: '1px solid #ddd', borderRadius: 2, maxHeight: 200, overflowY: 'auto' }}
          >
            {gateways.length > 0 ? (
              gateways.map((gateway) => (
                <ListItem
                  key={gateway.G_id}
                  button
                // onClick={() => setSelectedAssignedGateway(gateway.G_id)}
                >
                  <ListItemText primary={gateway.gateway_name} secondary={gateway.mac_address} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No Assigned Gateways" />
              </ListItem>
            )}
          </List>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1">Selected New Gateways</Typography>
          <List sx={{ border: '1px solid #ddd', borderRadius: 2, maxHeight: 200, overflowY: 'auto' }}>
            {selectedGatewaysList.length > 0 ? (
              selectedGatewaysList.map((gw) => (
                <ListItem key={gw.G_id}>
                  <ListItemText primary={gw.gateway_name} secondary={gw.mac_address} />
                </ListItem>
              ))
            ) : (
              <ListItem><ListItemText primary="No New Gateways Selected" /></ListItem>
            )}
          </List>
        </Box>
      </Box>}
    </Box>
  );
};

export default CreateUser;
