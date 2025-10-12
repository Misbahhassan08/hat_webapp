import { Box } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';
import Alerts from './alerts';
import NotificationContainer from './notificationContainer';


const Notification = () => {
  return (
    <Box display={'flex'} flexDirection={'column'} rowGap={2} mb={2}>
        <Alerts/>
        {/* <NotificationContainer/> */}
    </Box>
  );
};
export default Notification;






