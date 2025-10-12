import React from 'react'
import { CFooter } from '@coreui/react'
import { ColorModeContext } from '../views/theme/ThemeContext'
import { useTheme } from '@mui/material'

const AppFooter = () => {

  const theme = useTheme()

  return (
    <CFooter className="px-4" style={{background : theme.palette.background.footer}}>
      <div className="ms-auto">
        <span className="me-1" style={{color: '#ffffff'}}>Powered by </span>
        <a href="" target="_blank" rel="noopener noreferrer">
          MEXEMAI
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
