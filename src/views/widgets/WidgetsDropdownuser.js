import React from "react";
import { Paper, Typography, Box, useTheme } from "@mui/material";

function GatewayNode({ title, subtitle, icon, bgColor }) {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        flex: 1,
        padding: 2,
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        background: bgColor,
        overflow: "visible",
        minWidth: 0,
      }}
    >
      {/* Icon positioned absolutely at top-left */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          color: "white",
        }}
      >
        {icon}
      </Box>

      {/* Text content */}
      <Box sx={{  textAlign: "center"  }}>
        <Typography variant="subtitle2" fontWeight="bold" color="white">
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
