import React from "react";
import { Paper, Typography, Box, useTheme } from "@mui/material";
import { ColorModeContext } from '../theme/ThemeContext'


function GatewayNode({ title, subtitle, icon, bgColor }) {
  const theme = useTheme()
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 1,
        textAlign: "center",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        minWidth: "40px",
        flex: "1",
        position: "relative",
        overflow: "visible",
        background: bgColor,
      }}
    >
      {/* Small Icon Box with Gradient Background (Now on the Left Side) */}
      <Box
        sx={{
          width: 50,
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          
          color: "white",
          position: "absolute",
          top:-2,
          left:'0px'
        }}
      >
        {icon}
      </Box>
      <Box pl={2}>
      <Typography variant="subtitle2" fontWeight="bold" color="white" >
        {subtitle}
      </Typography>
      <Typography variant="subtitle2" fontWeight="bold" color="white">
        {title}
      </Typography>
      </Box>
    </Paper>
  );
}
export default GatewayNode;
