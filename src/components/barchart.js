import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const BarChartComponent = ({ xAxisData, seriesData, width, height }) => {
  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: xAxisData }]}
      series={seriesData}
      width={width}
      height={height}
    />
  );
};

export default BarChartComponent;