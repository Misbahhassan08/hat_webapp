import {
  TableCell, TableContainer, TableHead, TableRow, Box, Table, Paper, Typography,
  TableBody, IconButton, Menu, MenuItem, TextField, Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import urls from '../../urls/urls';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';

const ViewInvoices = () => {
  const [role, setRole] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setRole(user.role || '');
    }

    axios.get(urls.Invoice)
      .then(response => {
        const data = response.data;
        console.log('Fetched subscription data:', data);

        const enrichedData = data.map((item) => ({
          id: item.inv_id,
          date: item.subscription || 'N/A',
          username: item.start_date || 'N/A',
          email: item.end_date || 'N/A',
          phone: item.billing_price || 0,
          status: item.status || 'Unpaid',
        }));

        setSubscriptions(enrichedData);
      })
      .catch(error => {
        console.error('Error fetching subscriptions:', error);
      });
  }, []);

  const handleOpenDialog = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const handleStatusChange = async (newStatus) => {
    if (selectedRow === null) return;

    const updated = [...subscriptions];
    const invoice = updated.find((inv) => inv.id === selectedRow.id);
    const originalStatus = invoice.status;

    // Optimistically update UI
    invoice.status = newStatus;
    setSubscriptions(updated);

    try {
      // Send POST request to backend
      const response = await axios.post(
        urls.Invoice,
        {
          inv_id: invoice.id,
          status: newStatus,
        }
      );

      console.log('Status updated successfully:', response.data);
      handleCloseDialog(); // Close dialog after updating
    } catch (error) {
      console.error('Error updating invoice status:', error);

      // Revert UI on error
      invoice.status = originalStatus;
      setSubscriptions(updated);
    }
  };

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    return (
      subscription.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.id.toString().includes(searchTerm) ||
      subscription.phone.toString().includes(searchTerm) ||
      subscription.date.toString().includes(searchTerm)
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
        <Typography variant="h5">View Invoices</Typography>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '250px' }}
        />
      </Box>

      {role === 'admin' && (
        <TableContainer component={Paper} sx={{ overflow: "visible" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Sr No</b></TableCell>
                <TableCell><b>Invoice Id</b></TableCell>
                <TableCell><b>Subscription</b></TableCell>
                <TableCell><b>Start Date</b></TableCell>
                <TableCell><b>End Date</b></TableCell>
                <TableCell><b>Billing Price</b></TableCell>
                <TableCell><b>Status Paid</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubscriptions.map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => handleOpenDialog(row)}
                  hover
                  style={{
                    cursor: 'pointer',
                    transition: "all 0.3s ease-in-out",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  {['id', 'date', 'username', 'email', 'phone'].map((field, i) => (
                    <TableCell key={i}>{row[field]}</TableCell>
                  ))}
                  <TableCell>
                    <Typography
                      sx={{
                        display: 'inline-block',
                        padding: '5px 10px',
                        borderRadius: '12px',
                        backgroundColor: row.status === 'Paid' ? 'success.light' : 'warning.light',
                        color: 'white',
                      }}
                    >
                      {row.status}
                    </Typography>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <Box>
          <DialogTitle textAlign={'center'} sx={{ m: 0, p: 2, fontWeight: "bold" }}>
            Invoice Details
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
            <Box>
              <Typography fontWeight="bold">Bill To</Typography>
              <Typography>
                <b>start Date:</b> {selectedRow?.username}<br />
                <b>End Date:</b> {selectedRow?.email}<br />
                <b>Price:</b> {selectedRow?.phone}
              </Typography>
            </Box>
            <Box>
              <Typography fontWeight={'bold'}>Invoice #</Typography>
              <Typography>INV{selectedRow?.id}</Typography>

              <Box>
                <Typography fontWeight={'bold'}>Subscription</Typography>
                <Typography>{selectedRow?.date}</Typography>
              </Box>
            </Box>
            <Box>
              <Typography fontWeight={'bold'}>Billing Price</Typography>
              <Typography fontWeight={'bold'} fontSize={'large'}>PKR. {selectedRow?.phone}</Typography>
            </Box>
          </Box>
          <hr/>

        </DialogContent>

        <DialogActions>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Box>
              <Button
                onClick={() => handleStatusChange('Paid')}
                sx={{
                  backgroundColor: 'success.light',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'success.main',
                  },
                  marginRight: '10px',
                }}
              >
                Mark as Paid
              </Button>
              <Button
                onClick={() => handleStatusChange('Unpaid')}
                sx={{
                  backgroundColor: 'warning.light',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'warning.main',
                  },
                }}
              >
                Mark as Unpaid
              </Button>
            </Box>


          </Box>
        </DialogActions>

      </Dialog>
    </Box>
  );
};

export default ViewInvoices;
