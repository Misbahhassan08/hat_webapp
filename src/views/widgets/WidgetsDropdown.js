import React from "react";
import { Paper, Typography, Box, useTheme } from "@mui/material";
import { ColorModeContext } from '../theme/ThemeContext'


function GatewayNode({ title, subtitle, icon, bgColor }) {
  const theme = useTheme()
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        textAlign: "center",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
       width: "180px",   
       maxWidth: "220px",
       
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Small Icon Box with Gradient Background (Now on the Left Side) */}
      <Box
        sx={{
          width: 30,
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          background: bgColor,
          color: "white",
          position: "absolute",
          top: "-10px",
          left: "1px",
        }}
      >
        {icon}
      </Box>
      <Typography variant="subtitle2" color="gray" sx={{ marginTop: "20px" , color: theme.palette.text.TextColor }}>
        {subtitle}
      </Typography>
      <Typography variant="subtitle2" fontWeight="bold">
        {title}
      </Typography>
    </Paper>
  );
}
export default GatewayNode;
