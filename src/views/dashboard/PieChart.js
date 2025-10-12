import React from 'react';
import { Box, useTheme } from '@mui/material';
import { ResponsivePie } from '@nivo/pie';
import { ColorModeContext } from '../theme/ThemeContext';


const dummyData = [
  { id: "Group A", label: "Group A", value: 30, color: "hsl(123, 70%, 50%)" },
  { id: "Group B", label: "Group B", value: 50, color: "hsl(12, 70%, 50%)" },
  { id: "Group C", label: "Group C", value: 20, color: "hsl(240, 70%, 50%)" },
  { id: "Group D", label: "Group D", value: 40, color: "hsl(60, 70%, 50%)" },
  { id: "Group E", label: "Group E", value: 10, color: "hsl(300, 70%, 50%)" }
];



const PieChart = () => {


const theme = useTheme()


  return (
    <Box
      sx={{
        width: '230px',
        height: '230px',
        border: "1px solid #ccc",  // Add border to the box
        borderRadius: "8px",       // Round corners
        background : theme.palette.background.paper, // Light background color
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Box shadow for better visual separation
        display: 'flex',
        justifyContent: 'center', // Center the pie chart horizontally
        alignItems: 'center',     // Center the pie chart vertically
      }}
    >
      {/* ResponsivePie component without setting 100% height/width directly */}
      <ResponsivePie
        data={dummyData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        height={220}  // Ensure the pie chart fits within the Box
        width={220}   // Ensure the pie chart fits within the Box
      />
    </Box>
  );
};

export default PieChart;
