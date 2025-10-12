import {
  TableCell, TableContainer, TableHead, TableRow, Box, Table, Paper, Typography,
  TableBody, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserIdFromLocalStorage } from '../../data/localStorage';
import urls from '../../urls/urls';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material'; // Add these imports at the top


const ManageInvoices = () => {
  const [role, setRole] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedRow, setEditedRow] = useState({});
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHardware, setSelectedHardware] = useState({});

  const dummyProjects = [
    {
      projectName: 'Project 1',
      hardware: ['Hardware 1', 'Hardware 2', 'Hardware 3'],
    },
    {
      projectName: 'Project 2',
      hardware: ['Hardware A', 'Hardware B'],
    },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setRole(user.role || '');
    }
  
    axios.get(urls.CreateOrUpdateSubscription)
      .then(response => {
        const data = response.data;
        console.log('Fetched subscription data:', data);
  
        const enrichedData = data.map((item) => ({
          id: item.sub_id,
          date: item.Active_date || 'N/A',
          username: item.firstname || 'N/A',
          email: item.email || 'N/A',
          phone: item.contact || 'N/A',
          userId: item.user_id,
          projects: 0,
          unit_price: item.price || '0.00',
          discount: item.discount || '0.00',
          total: calculateTotal(item.price, item.discount),
          warn_time: item.warn_days || 'N/A',
          stop_time: item.stop_days || 'N/A',
          status: item.status || 'Unpaid',
        }));
  
        setSubscriptions(enrichedData);
      })
      .catch(error => {
        console.error('Error fetching subscriptions:', error);
      });
  
    // Initialize selected hardware with all selected by default
    const initialHardwareSelection = {};
    dummyProjects.forEach(project => {
      project.hardware.forEach(hardware => {
        initialHardwareSelection[`${project.projectName}-${hardware}`] = true; // Set to true to select by default
      });
    });
    setSelectedHardware(initialHardwareSelection);
  }, []);
  
  

  const calculateTotal = (price, discount) => {
    const priceVal = parseFloat(price || 0);
    const discountVal = parseFloat(discount || 0);
    return (priceVal - (priceVal * discountVal / 100)).toFixed(2);
  };

  const handleEditClick = (index) => {
    setEditRowIndex(index);
    setEditedRow(subscriptions[index]);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditedRow({});
    setEditRowIndex(null);
    setSelectedHardware({});
  };

  const handleSaveClick = async () => {
    // Calculate total hardware count
    const selectedCount = Object.values(selectedHardware).filter(val => val).length;
    const hardwarePrice = 2000; // fixed price
    const newUnitPrice = selectedCount * hardwarePrice;

    const updatedRow = {
      ...editedRow,
      unit_price: newUnitPrice.toFixed(2),
      total: calculateTotal(newUnitPrice, editedRow.discount),
      projects: dummyProjects.length,
    };

    const updated = [...subscriptions];
    updated[editRowIndex] = updatedRow;
    setSubscriptions(updated);
    handleDialogClose();

    const payload = {
      user_id: parseInt(updatedRow.userId),
      price: parseFloat(updatedRow.unit_price),
      discount: parseFloat(updatedRow.discount),
      warn_days: parseFloat(updatedRow.warn_time),
      stop_days: parseFloat(updatedRow.stop_time),
    };

    console.log('Payload:', payload);

    try {
      const response = await axios.post(
        urls.CreateOrUpdateSubscription,
        payload
      );
      console.log('POST success:', response.data);
    } catch (error) {
      console.error('Error posting invoice update:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    return (
      subscription.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.phone.includes(searchQuery) ||
      subscription.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Box sx={{ padding: 3 }}>
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
        <Typography variant="h5" sx={{ color: '#fff' }}>Manage Invoices</Typography>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: '200px', backgroundColor: '#fff', borderRadius: 1 }}
        />
      </Box>

      {role === 'admin' && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Sr No</b></TableCell>
                <TableCell><b>Id</b></TableCell>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Username</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Phone</b></TableCell>
                <TableCell><b>Projects</b></TableCell>
                <TableCell><b>Price</b></TableCell>
                <TableCell><b>Discount</b></TableCell>
                <TableCell><b>Total</b></TableCell>
                <TableCell><b>Warn Time</b></TableCell>
                <TableCell><b>Stop Time</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubscriptions.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.projects}</TableCell>
                  <TableCell>{row.unit_price}</TableCell>
                  <TableCell>{row.discount}</TableCell>
                  <TableCell>{row.total}</TableCell>
                  <TableCell>{row.warn_time}</TableCell>
                  <TableCell>{row.stop_time}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => handleEditClick(index)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="lg">

        <DialogTitle>Edit Invoice</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, }}>


  {/* Add fields for discount, warn time, stop time */}
  <Box sx={{paddingTop: 2,display: 'flex', flexDirection: 'column', rowGap: 2}}>
  <TextField
    label="Discount (%)"
    type="number"
    fullWidth
    value={editedRow.discount || ''}
    onChange={(e) => handleInputChange('discount', e.target.value)}
  />
  <TextField
    label="Warn Time (days)"
    type="number"
    fullWidth
    value={editedRow.warn_time || ''}
    onChange={(e) => handleInputChange('warn_time', e.target.value)}
  />
  <TextField
    label="Stop Time (days)"
    type="number"
    fullWidth
    value={editedRow.stop_time || ''}
    onChange={(e) => handleInputChange('stop_time', e.target.value)}
  />

</Box>

{dummyProjects.map((project, projectIndex) => (
    <Box key={projectIndex} sx={{ mt: 2 }}>
      <Typography variant="h6">{project.projectName}</Typography>

      <FormControl fullWidth sx={{ mt: 1 }}>
        <InputLabel>Select Hardware</InputLabel>
        <Select
          multiple
          value={
            Object.keys(selectedHardware)
              .filter(key => selectedHardware[key])
              .filter(key => key.startsWith(`${project.projectName}-`))
          }
          onChange={(e) => {
            const selected = e.target.value;
            const updatedSelections = { ...selectedHardware };

            // Reset previous selections for this project
            project.hardware.forEach(hardware => {
              updatedSelections[`${project.projectName}-${hardware}`] = false;
            });

            // Set selected hardwares to true
            selected.forEach(item => {
              updatedSelections[item] = true;
            });

            setSelectedHardware(updatedSelections);
          }}
          renderValue={(selected) => selected.map(sel => sel.split('-')[1]).join(', ')}
        >
          {project.hardware.map((hardware, hardwareIndex) => (
            <MenuItem key={hardwareIndex} value={`${project.projectName}-${hardware}`}>
              {hardware} - Price: 2000
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  ))}
</DialogContent>


        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveClick}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageInvoices;
