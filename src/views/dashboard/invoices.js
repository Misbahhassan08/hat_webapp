import { TableCell, TableContainer, TableHead, TableRow, Box, Table, Paper, Typography, TableBody, useTheme, IconButton, Divider, } from '@mui/material'
import { theme } from 'highcharts';
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import { Download, DownloadOutlined } from '@mui/icons-material';
import { Bold } from 'lucide-react';
import urls from '../../urls/urls';
import { getUserIdFromLocalStorage } from '../../data/localStorage';
import axios from 'axios'



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));



const invoices = () => {
  const [role, setRole] = useState('');



  useEffect(() => {
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setRole(user.role || ''); // Set role from localStorage
    }
  }, []);


  // Dummy invoice data
  const invoicesData = [
    { id: "INV001", month: "January", issueDate: "2024-01-05", dueDate: "2024-01-20", amount: "500", status: "Paid" },
    { id: "INV002", month: "February", issueDate: "2024-02-07", dueDate: "2024-02-22", amount: "650", status: "Paid" },
    { id: "INV003", month: "March", issueDate: "2024-03-10", dueDate: "2024-03-25", amount: "750", status: "Unpaid" },
    { id: "INV004", month: "April", issueDate: "2024-04-12", dueDate: "2024-04-27", amount: "400", status: "Unpaid" },
    { id: "INV005", month: "May", issueDate: "2024-05-14", dueDate: "2024-05-29", amount: "900", status: "Pending" },
  ];
  const theme = useTheme()

  const [open, setOpen] = React.useState(false);


  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = (subscription) => {
    setSelectedSubscription(subscription); // Save clicked data
    setOpen(true); // Open the dialog
  };

  const handleClickOpenUser = (invoice) => {
    setSelectedInvoices(invoice); // Save clicked data
    setOpen(true); // Open the dialog
  };

  const [subscriptions, setSubscriptions] = useState([]);
  const [invoices, setInvoice] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState(null);
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    const [image, setImage] = useState('')
      const [contact, setContact] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [address, setAddress] = useState('')
    const userId = loggedInUser?.user_id;

    const [userData, setUserData] = useState('')


  useEffect(() => {
    // Fetch data from the backend API
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(urls.CreateOrUpdateSubscription);
        const data = await response.json();
        if (response.ok) {
          setSubscriptions(data); // Assuming data is an array of subscriptions
        } else {
          console.error("Failed to fetch subscriptions:", data.error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  useEffect(() => {
    // Fetch data from the backend API
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(urls.Invoice);
        const data = await response.json();
        if (response.ok) {
          setInvoice(data); // Assuming data is an array of subscriptions
        } else {
          console.error("Failed to fetch subscriptions:", data.error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

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
  
        setFormData({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          contact: user.contact || '',
          role: user.role,
          zip_code: user.zip_code || '',
          address: user.adress || '', // typo fix
          imageBase64: user.image,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [getUserIdFromLocalStorage()]);
  

  // Render a loading indicator while the data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }


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
          borderRadius: ' 8px',
        }}
      >
        {/* Left: Heading */}
        <Typography variant="h5">User Invoices</Typography>



      </Box>

      
      {role === 'user' &&
  <TableContainer component={Paper} sx={{ overflow: "visible" }} >
    <Table>
      <TableHead>
        <TableRow>
          <TableCell style={{ fontWeight: "bold" }}>Sr No</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>Invoice Id</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>Subscription</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>Start Date</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>End Date</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>Price PKR</TableCell>
          <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {invoices.map((invoice, index) => (
          <TableRow
            key={invoice.sub_id}
            onClick={() => handleClickOpenUser(invoice)}

            hover
            style={{
              cursor: 'pointer',
              transition: "all 0.3s ease-in-out",
              borderRadius: "8px",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
              e.currentTarget.style.backgroundColor = theme.palette.background.paper;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <TableCell>{index + 1}</TableCell> {/* Serial No */}
            <TableCell>{invoice.inv_id}</TableCell>
            <TableCell>{invoice.subscription}</TableCell>
            <TableCell>{invoice.start_date}</TableCell>
            <TableCell>{invoice.end_date}</TableCell>
            <TableCell>{invoice.billing_price}</TableCell>
            <TableCell>
              <Typography 
                sx={{ 
                  display: 'inline-block',
                  padding: '5px 10px',
                  borderRadius: '12px',
                  backgroundColor: invoice.status === 'Paid' ? 'success.light' : 'warning.light',
                  color: 'white',
                }}
              >
                {invoice.status}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
}


{role === 'superadmin' &&
       <TableContainer component={Paper} sx={{ overflow: "visible" }}>
       <Table>
         <TableHead>
           <TableRow>
           <TableCell style={{ fontWeight: "bold" }}>Sr No.</TableCell>

             <TableCell style={{ fontWeight: "bold" }}>Id</TableCell>
             <TableCell style={{ fontWeight: "bold" }}>Warn Date</TableCell>
             <TableCell style={{ fontWeight: "bold" }}>Stop Date</TableCell>
             <TableCell style={{ fontWeight: "bold" }}>Amount PKR</TableCell>
             <TableCell style={{ fontWeight: "bold" }}>Discount</TableCell>
             <TableCell style={{ fontWeight: "bold" }}>User Id</TableCell>
             <TableCell style={{ fontWeight: "bold" }}>Time Stamp</TableCell>
             <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           {subscriptions.map((subscription, index) => (
             <TableRow
             key={subscription.sub_id}
             onClick={() => handleClickOpen(subscription)}
               hover
               style={{
                 cursor: 'pointer',
                 transition: "all 0.3s ease-in-out",
                 borderRadius: "8px",
                 overflow: "hidden",
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = "scale(1.02)";
                 e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
                 e.currentTarget.style.backgroundColor = theme.palette.background.paper;
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = "scale(1)";
                 e.currentTarget.style.boxShadow = "none";
                 e.currentTarget.style.backgroundColor = "transparent";
               }}
             >
                             <TableCell>{index + 1}</TableCell>

               <TableCell>{subscription.sub_id}</TableCell>
               <TableCell>{subscription.warn_days}</TableCell>
               <TableCell>{subscription.stop_days}</TableCell>
               <TableCell>{subscription.price}</TableCell>
               <TableCell>{subscription.discount}</TableCell>
               <TableCell>{subscription.user_id}</TableCell>
               <TableCell>{subscription.Active_date}</TableCell>
               <TableCell>
  <span
    style={{
      display: "inline-block",
      width: "80px",
      textAlign: "center",
      padding: "5px 10px",
      borderRadius: "5px",
      color: "#fff",
      backgroundColor:
        subscription.status === "Active"
          ? "#4EA44D"  // Green for Paid (Active)
          : subscription.status === "Inactive"
          ? "#F39C12"  // Orange for Unpaid (Inactive)
          : "red",     // Default color if the status is something unexpected
    }}
  >
    {subscription.status === "Active" ? "Paid" : "Unpaid"}
  </span>
</TableCell>

             </TableRow>
           ))}
         </TableBody>
       </Table>
     </TableContainer>
}

{role === 'superadmin' &&
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        fullWidth
        

      >
        <Box>

          <DialogTitle textAlign={'center'} sx={{ m: 0, p: 2, fontWeight: "bold", }} id="customized-dialog-title">
            Invoice
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

        </Box>
        {selectedSubscription && (
  <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
    <Box>
      <Typography fontWeight="bold">Bill To</Typography>
      <Typography>
        {selectedSubscription.firstname}<br />
        {selectedSubscription.email}<br />
        {selectedSubscription.contact}
      </Typography>
    </Box>

    <Box>
      <Typography fontWeight={'bold'}>
        Invoice #
      </Typography>
      <Typography>
        INV{selectedSubscription.sub_id}
      </Typography>

      <Box>
        <Typography fontWeight={'bold'}>
          Payment Terms
        </Typography>
        <Typography>
          Net 30
        </Typography>
      </Box>
    </Box>

    <Box>
      <Box>
        <Typography fontWeight={'bold'}>
          Issue Date
        </Typography>
        <Typography>
          {selectedSubscription.Active_date}
        </Typography>
      </Box>
      <Box>
        <Typography fontWeight={'bold'}>
          Due Days
        </Typography>
        <Typography>
          {selectedSubscription.warn_days}
        </Typography>
      </Box>
    </Box>

    <Box>
      <Typography fontWeight={'bold'}>
        Amount Due
      </Typography>
      <Typography fontWeight={'bold'} fontSize={'large'}>
        {selectedSubscription.price}
      </Typography>
    </Box>
  </Box>
)}

        <br />
        {selectedSubscription && (
        <DialogContent dividers>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell><Typography fontWeight="bold">Projects</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight="bold">Hardware</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight="bold">Amount</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Dummy Data Rows */}
              <TableRow>
                <TableCell>Product A</TableCell>
                <TableCell align="right">Rs.{selectedSubscription.price}</TableCell>
                <TableCell align="right">Rs. {selectedSubscription.price - selectedSubscription.discount}</TableCell>
              </TableRow>
  
            </TableBody>
          </Table>
        </DialogContent>
         )}
   
        <Divider />

        <hr />
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            <Download fontSize='small' /> Download
          </Button>

        </DialogActions>
      </BootstrapDialog>
}



{role === 'user' && selectedInvoices && (
  <BootstrapDialog
  onClose={handleClose}
  aria-labelledby="customized-dialog-title"
  open={open}
  maxWidth="md"
  fullWidth
  

>
<Box>

<DialogTitle textAlign={'center'} sx={{ m: 0, p: 2, fontWeight: "bold", }} id="customized-dialog-title">
  Invoice
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

</Box>
     <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
    <Box>
      <Typography fontWeight="bold">Bill To</Typography>
      <Typography>
    <b> Name: </b>{firstname}<br />
    <b> Email: </b>{email}<br />
    <b> Ph: </b>{contact}
      </Typography>
    </Box>

    <Box>
      <Typography fontWeight={'bold'}>
        Invoice #
      </Typography>
      <Typography>
        INV{selectedInvoices.inv_id}
      </Typography>

      <Box>
        <Typography fontWeight={'bold'}>
          Subscription
        </Typography>
        <Typography>
        {selectedInvoices.subscription}
        </Typography>
      </Box>
    </Box>

    <Box>
      <Box>
        <Typography fontWeight={'bold'}>
          Start Date
        </Typography>
        <Typography>
        {selectedInvoices.start_date}
        </Typography>
      </Box>
      <Box>
        <Typography fontWeight={'bold'}>
          End date
        </Typography>
        <Typography>
        {selectedInvoices.end_date}
        </Typography>
      </Box>
    </Box>

    <Box>
      <Typography fontWeight={'bold'}>
        Billing Price
      </Typography>
      <Typography fontWeight={'bold'} fontSize={'large'}> PKR. 
      {selectedInvoices.billing_price}
      </Typography>
    </Box>
  </Box>
  <br />
       
        <DialogContent dividers>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell><Typography fontWeight="bold">Projects</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight="bold">Hardware</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight="bold">Amount</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Dummy Data Rows */}
               <TableRow>
                <TableCell></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
  
            </TableBody>
          </Table>
        </DialogContent>
    <DialogActions>
    <Button autoFocus onClick={handleClose}>
            <Download fontSize='small' /> Download
          </Button>
    </DialogActions>
  </BootstrapDialog>
)}







    </Box>

  )
}

export default invoices
