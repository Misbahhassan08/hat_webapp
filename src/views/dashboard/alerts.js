import { Box, Card, Stack, Typography } from '@mui/material';
import React from 'react';
import AlertsCard from './alertsCard';
import alertsData from './alertsData';

const Alerts = () => {
  return (
    <Card sx={{ p: 2, borderRadius: 4, marginX: 24 , mb: 2 }}>
      <Typography sx={{ fontSize: '16px', fontWeight: '600', color: ' #344767', mb: 2 }}>Alerts</Typography>
      <Stack >
        {alertsData.map((alert, index) => (
          <AlertsCard key={index} bgColor={alert.bgColor} text={alert.text} />
        ))}
      </Stack>
    </Card>
  );
};
export default Alerts;






