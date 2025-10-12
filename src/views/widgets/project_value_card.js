import React from "react";
import { Paper, Typography, Box, useTheme } from "@mui/material";

function GatewayNode({ title, subtitle, icon, bgColor }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  
  const textColor = isLight ? "#344767" :"#24A58D"     
  const textColor2 = isLight ? "#344767" :"white"     
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
      {/* Icon */}
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
          top: -2,
          left: "0px",
        }}
      >
        {icon}
      </Box>

      <Box pl={2}>
        <Typography variant="body1" fontWeight="600" sx={{ color: textColor }}>
          {subtitle}
        </Typography>
        <Typography variant="body2" fontWeight="600" sx={{ color: textColor2 }}>
          {title}
        </Typography>
      </Box> 
    </Paper>
  );
}

export default GatewayNode;
