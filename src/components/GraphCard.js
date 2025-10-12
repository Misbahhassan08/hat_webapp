// GraphCard.jsx
import { Box, Card, Typography } from '@mui/material'
import React from 'react'
import { LineChart } from '@mui/x-charts/LineChart';

const GraphCard = ({ title, subTitle, caption, gradientGraphbg, graphData }) => {
  return (
    <Card sx={{ mt: 5, padding: 2, flex: 2, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 2, overflow: 'visible' }}>
      <Box sx={{ mt: -5, borderRadius: 3, background: gradientGraphbg }} >
        <LineChart
          xAxis={[{
            scaleType: "band",
            data: graphData?.labels || ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
            tickLabelStyle: { fill: "#FFFFFF" },
            color: "transparent",
            domainPadding: 10,
          }]}
          yAxis={[{
            tickLabelStyle: { fill: "#FFFFFF" },
            color: "transparent",
          }]}
          series={[{
            data: graphData?.values || [],
            color: "#FFFFFF",
            lineThickness: 2,
            marker: {
              shape: "circle",
              size: 5,
            },
          }]}
          height={200}
          grid={{ vertical: true, horizontal: true, color: "#FFFFFF50" }}
          slotProps={{
            line: { style: { borderRadius: "6px" } },
          }}
        />
      </Box>

      <Box px={2}>
        <Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>
        <Typography sx={{ fontWeight: 'bold' }}>{subTitle}</Typography>
      </Box>
      <Box px={2} alignItems={'center'} sx={{ display: 'flex', flexDirection: 'row', columnGap: 0.5 }}>
        <Typography sx={{ fontSize: '14px', color: ' #6C757D' }}>
          {caption}
        </Typography>
      </Box>
    </Card>
  )
}

export default GraphCard;
