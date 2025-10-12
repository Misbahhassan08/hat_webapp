import { AddRounded } from '@mui/icons-material';
import {
  Button, Typography, DialogTitle, DialogContent, DialogActions, Dialog, Box, styled, useTheme, IconButton, TextField,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import urls from '../../urls/urls'
import CloseIcon from '@mui/icons-material/Close';
import { saveUserToLocalStorage, getUserFromLocalStorage } from '../../data/localStorage';
import axios from 'axios'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useRef } from 'react';
// Add this import at the top with other imports
import 'leaflet/dist/leaflet.css';







const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


const AddProject = () => {

  const handleClickOpen = () => setOpen(true);
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [address, setAddress] = useState('');
  const theme = useTheme()
  const mapRef = useRef();

  const [errors, setErrors] = useState({
    projectName: '',
    longitude: '',
    latitude: '',
    address: '',
  });


  const handleClose = () => {
    setOpen(false);
    setProjectName('');
    setLongitude('');
    setLatitude('');
    setAddress('');
  };

  const handleSave = async () => {
    const newErrors = {
      projectName: projectName ? '' : 'Project name is required',
      longitude: /^\d*\.?\d+$/.test(longitude) ? '' : longitude ? 'Only numbers allowed' : 'Longitude is required',
      latitude: /^\d*\.?\d+$/.test(latitude) ? '' : latitude ? 'Only numbers allowed' : 'Latitude is required',
      address: address ? '' : 'Address is required',
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(err => err);
    if (hasError) return;

    const user = getUserFromLocalStorage();

    const newProject = {
      name: projectName,
      longitude,
      latitude,
      address,
      user_id: user ? user.user_id : null,
    };

    try {
      const response = await axios.post(urls.createProject, newProject);
      if (response.data) {
        fetchProjects();
      }
      handleClose();
    } catch (error) {
      console.error("Error Posting Project", error.response || error.message || error);
    }
  };

  const LocationSelector = ({ latitude, longitude, setLatitude, setLongitude }) => {
    useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat.toFixed(6));
        setLongitude(e.latlng.lng.toFixed(6));
      },
    });
  
    return null;
  };

  useEffect(() => {
    if (open && mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 300); // wait for dialog to open and render fully
    }
  }, [open]);
  
  
  const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });


  const fetchProjects = async () => {
    try {
      const response = await axios.get(urls.getUserProjects()); // Get URL from the helper
      console.log("USER projects:", response.data);

      setProjects(Array.isArray(response.data.project_managers) ? response.data.project_managers : []);
    } catch (error) {
      console.error("Error Fetching Projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);


  return (
    <Box>
      <Button
        onClick={handleClickOpen}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          padding: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.2)", // semi-transparent background
          backdropFilter: "blur(15px)", // creates the blur effect
          borderRadius: "4px", // rounded corners for a smoother look
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0)", // optional shadow for depth
        }}
      >
        <AddRounded
          sx={{ color: "white" }} aria-label="add_project" />
        <Typography sx={{ color: "white", fontSize: "14px", fontWeight: 600 }}>
          Create Project
        </Typography>
      </Button>

      {/* Dialog for Creating a Project */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "11px",
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, color: theme.palette.text.primary, fontWeight: "600", fontSize: "18px" }} id="customized-dialog-title">
          Create Project
        </DialogTitle>
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
  <Box display="flex" flexDirection="column" rowGap={2} width="100%">
    <TextField
      size="small"
      fullWidth
      label="Project Name"
      variant="outlined"
      value={projectName}
      onChange={(e) => setProjectName(e.target.value)}
      error={Boolean(errors.projectName)}
      helperText={errors.projectName}
    />

    <TextField
      size="small"
      fullWidth
      label="Longitude"
      variant="outlined"
      value={longitude}
      onChange={(e) => setLongitude(e.target.value)}
      error={Boolean(errors.longitude)}
      helperText={errors.longitude}
    />

    <TextField
      size="small"
      fullWidth
      label="Latitude"
      variant="outlined"
      value={latitude}
      onChange={(e) => setLatitude(e.target.value)}
      error={Boolean(errors.latitude)}
      helperText={errors.latitude}
    />

    <TextField
      size="small"
      fullWidth
      label="Address"
      variant="outlined"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      error={Boolean(errors.address)}
      helperText={errors.address}
    />

    {/* Scrollable Map Box */}

<Box
  sx={{
    mt: 2,
    height: '320px',
    border: '1px solid #ccc',
    borderRadius: 2,
    overflow: 'hidden',
  }}
>
  <MapContainer
    center={[
      parseFloat(latitude) || 33.6844,
      parseFloat(longitude) || 73.0479,
    ]}
    zoom={13}
    scrollWheelZoom={true}
    zoomControl={true}
    style={{ height: '100%', width: '100%' }}
    whenCreated={(mapInstance) => {
      mapRef.current = mapInstance;
      setTimeout(() => {
        mapInstance.invalidateSize();
      }, 0);
    }}
  >
    <TileLayer
      attribution=''
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <LocationSelector
      latitude={latitude}
      longitude={longitude}
      setLatitude={setLatitude}
      setLongitude={setLongitude}
    />
    {latitude && longitude && (
      <Marker
        position={[parseFloat(latitude), parseFloat(longitude)]}
        icon={markerIcon}
      />
    )}
  </MapContainer>
</Box>


  </Box>
</DialogContent>

        <DialogActions>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="medium"
              onClick={handleSave}
              sx={{

                color: "white",
                fontSize: "12px",
                fontWeight: "600",

              }}
            >
              Save
            </Button>
          </Box>
        </DialogActions>
      </BootstrapDialog>
    </Box>
  )
}

export default AddProject
