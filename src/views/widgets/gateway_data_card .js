import React from "react";
import { Typography, Box, useTheme,Paper, } from "@mui/material";

function GatewayNode({ title, subtitle, icon, bgColor }) {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        padding: 2,
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: bgColor,
        minWidth: "200px", // ensure enough space to wrap
        maxWidth: "240px", // optional limit to encourage wrapping
        position: "relative",
        overflow: "hidden",
        color: "white",
        flex: 1,
      }}
    >
      {/* Text Section - aligned left */}
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{
            wordWrap: "break-word",
            whiteSpace: "normal", // allow wrapping
          }}
        >
          {subtitle}
        </Typography>
        <Typography variant="subtitle2" fontWeight="bold">
          {title}
        </Typography>
      </Box>

      {/* Icon Section - aligned right */}
      <Box
        sx={{
          width: 50,
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          color: "white",
          marginLeft: 1,
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
}

export default GatewayNode;
