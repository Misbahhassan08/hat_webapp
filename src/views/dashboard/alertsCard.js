import { Close } from '@mui/icons-material'
import { Alert, Collapse, IconButton } from '@mui/material'
import React from 'react'
const AlertsCard = ({ text, bgColor }) => {
  const [open, setOpen] = React.useState(true)
  return (
    <Collapse in={open}>
      <Alert
        icon={false}
        action={
          <IconButton
            aria-label="close"
            sx={{ color: 'white' }}
            size="small"
            onClick={() => {
              setOpen(false)
            }}
          >
            <Close fontSize="inherit" />
          </IconButton>
        }
        sx={{ color: 'white', mb: 2, bgcolor: bgColor }}
      >
        {text}
      </Alert>
    </Collapse>
  )
}

export default AlertsCard
