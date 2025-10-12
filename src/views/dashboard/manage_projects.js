import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  useTheme,
  Button,
  IconButton,
} from '@mui/material'
import urls from '../../urls/urls'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Edit } from '@mui/icons-material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useRef } from 'react'

// Fix missing marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

// Moved styled component outside the main component
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

const ManageProjects = () => {
  const navigate = useNavigate()
  const theme = useTheme()

  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [userProjects, setUserProjects] = useState([])

  const [open, setOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  const [projectName, setProjectName] = useState('')
  const [longitude, setLongitude] = useState('')
  const [latitude, setLatitude] = useState('')
  const [address, setAddress] = useState('')
  const [errors, setErrors] = useState({})
  const mapRef = useRef()


  const LocationSelector = ({ setLatitude, setLongitude }) => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng
        setLatitude(lat.toFixed(6))
        setLongitude(lng.toFixed(6))
      },
    })
    return null
  }
  

  const handleClickOpen = useCallback((project) => {
    setSelectedProject(project)
    setProjectName(project.name || '')
    setLongitude(project.longitude || '')
    setLatitude(project.latitude || '')
    setAddress(project.address || '')
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    setSelectedProject(null)
    setErrors({})
  }, [])

  

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
    try {
      const updatedProject = {
        name: projectName,
        longitude,
        latitude,
        address,
      };

      const updateUrl = `${urls.updateProject}${selectedProject.PM_id}/`;

      const response = await axios.post(updateUrl, updatedProject);
      console.log('Project Updated:', response.data);
      handleClose();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get(urls.getUserProjects())
      console.log('USER projects:', response.data)
  
      setUserProjects(Array.isArray(response.data.project_managers) ? response.data.project_managers : [])
    } catch (error) {
      console.error('Error Fetching Projects', error)
    } finally {
      setLoading(false)
    }
  }, []) // remove `open` from dependency
  
  useEffect(() => {
    if (!open) {
      fetchProjects()
    }
  }, [open, fetchProjects])
  

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])
  

  const filteredUserProjects = userProjects
    .filter(
      (project) =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.PM_id?.toString().includes(searchTerm) ||
        project.address?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const search = searchTerm.toLowerCase()
      const aStarts = a.name?.toLowerCase().startsWith(search)
      const bStarts = b.name?.toLowerCase().startsWith(search)
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      return 0
    })


    return (
        <Box padding={3}>
          {/* ... other JSX elements */}
          <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
            background: 'linear-gradient(135deg,rgb(103, 182, 247),rgb(50, 120, 185))',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          <Typography variant="h5">Manage Projects</Typography>
          <TextField
            variant="outlined"
            placeholder="Search User"
            size="small"
            sx={{
              width: '250px',
              background: theme.palette.background.paper,
              borderRadius: '4px',
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        <TableContainer component={Paper} sx={{ overflow: 'visible' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Sr No</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Project ID</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Project Name</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Address</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Connected Gateways</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUserProjects.map((project, index) => (
                <TableRow key={project.PM_id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{project.PM_id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.address}</TableCell>
                  <TableCell>{project.connected_gateways.length}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      disableElevation
                      disableRipple
                      sx={{
                        p: 0,
                        px: 1,
                        bgcolor: project.is_active ? '#4EA44D' : 'red',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                        boxShadow: 'none',
                        pointerEvents: 'none',
                        cursor: 'default',
                        '&:hover': {
                          bgcolor: project.is_active ? '#4EA44D' : 'red',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      {project.is_active ? 'Active' : 'Inactive'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleClickOpen(project)}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </Box>
    
          {/* Use the BootstrapDialog component defined outside */}
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: { borderRadius: '11px' },
            }}ss
          >
                  <DialogTitle sx={{ m: 0, p: 2, fontWeight: '600', fontSize: '18px' }} id="customized-dialog-title">
          {selectedProject ? 'Edit Project' : 'Create Project'}
        </DialogTitle>
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box display={'flex'} flexDirection={'column'} rowGap={2} width="100%">
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
      mapRef.current = mapInstance
      setTimeout(() => {
        mapInstance.invalidateSize()
      }, 0)
    }}
  >
    <TileLayer
      attribution=""
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <LocationSelector
      latitude={latitude}
      longitude={longitude}
      setLatitude={setLatitude}
      setLongitude={setLongitude}
    />
    {latitude && longitude && (
      <Marker position={[parseFloat(latitude), parseFloat(longitude)]} />
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
              sx={{ color: 'white', fontSize: '12px', fontWeight: '600' }}
            >
              Save
            </Button>
          </Box>
        </DialogActions>
          </BootstrapDialog>
        </Box>
      )
    }
    
    export default ManageProjects


