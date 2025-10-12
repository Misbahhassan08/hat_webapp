import { Facebook, GitHub, Google, Warning } from '@mui/icons-material';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import React from 'react';

const AccessDenied = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
        p: 2,
      }}
    >
      <Card
        sx={{
          bgcolor: 'white',
          width: '320px',
          borderRadius: 3,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          rowGap: 3,
          alignItems: 'center',
          overflow:'visible'
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(to top,rgb(34,123,233),rgb(66,156,239))',
            padding: 4,
            borderRadius: 2,
            marginTop: -6,
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Warning sx={{ color: 'white', fontSize: 40 }} />
          <Typography variant='h6' fontWeight={600} color='white'>
            Access Denied
          </Typography>
        </Box>
        <Card sx={{ padding: 2, textAlign: 'center', width: '100%' }}>
          <Typography variant='h6' fontWeight={'bold'}>Overdue Payment</Typography>
          <Typography variant='h6' fontWeight={'bold'}>PKR. 500000</Typography>

        </Card>
        <Button
          variant='contained'
          sx={{ background: 'linear-gradient(to top,rgb(34,123,233),rgb(66,156,239))', width: '100%' }}
        >
          Pay Now
        </Button>
        <Typography color='#7C819B' textAlign='center' sx={{ fontSize: '0.875rem' }}>
          Note: If you do not pay your pending payment, you will not be able to access your dashboard.
        </Typography>
      </Card>
    </Box>
  );
};

export default AccessDenied;
