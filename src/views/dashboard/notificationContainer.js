import { Typography, Card, Box,} from '@mui/material'
import React from 'react'
const NotificationContainer = () => {
  return (
    <Card sx={{p:2, borderRadius:4, marginX:24}}>
      <Typography sx={{fontSize:'16px', fontWeight:'600', color:' #344767', mb:2}}>Notifications</Typography>
      <Typography sx={{fontSize:'14px',  color:' #6C757D', mb:2}}>Notifications on this page use Material UI Toast. Read more details here.
      </Typography>
      <Box sx={{display:'flex', flexDirection:'row', justifyContent:'space-around'}} >
      </Box>
    </Card>
  )
}
export default NotificationContainer
