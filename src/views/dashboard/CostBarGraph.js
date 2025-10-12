import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const HighChart = ({ title = "Monthly Costs", data = [], yAxisLabel = "Cost (PKR)" }) => {
  console.log("📊 Chart Data Received in HighChart Component:", data);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const dummyData = [
    {
      name: "Cost",
      data: [1200, 1500, 1100, 1700, 1400, 1600, 1900, 1800, 1700, 2000, 2100, 2200]
    }
  ];

  const chartData = Array.isArray(data) && data.length > 0 ? data : dummyData;

  const options = {
    chart: {
      type: "column",
      backgroundColor: "transparent", // ✅ Remove background
      spacing: [10, 10, 15, 10]
    },
    title: {
      text: '',
      style: { color: "#000", fontSize: "16px" }
    },
    xAxis: {
      categories: months,
      title: { text: "Month", style: { fontSize: "12px" } },
      labels: { style: { fontSize: "10px" } },
      gridLineWidth: 1, // ✅ Add vertical grid lines
      gridLineColor: "#e0e0e0"
    },
    yAxis: {
      min: 0,
      title: {
        text: yAxisLabel,
        style: { fontSize: "12px" }
      },
      labels: { style: { fontSize: "10px" } },
      gridLineWidth: 1, // ✅ Add horizontal grid lines
      gridLineColor: "#e0e0e0"
    },
    series: chartData.map((seriesItem) => ({
      name: seriesItem.name || "Unnamed Series",
      data: seriesItem.data || [],
      color: "#0C101B"
    })),
    plotOptions: {
      column: {
        borderRadius: 0, // ✅ No rounded corners
        pointPadding: 0,
        borderWidth: 0
      },
      series: {
        marker: { enabled: false },
        dataLabels: {
          enabled: false,
          style: { fontSize: "9px" }
        }
      }
    },
    credits: { enabled: false },
    legend: {
      itemStyle: { fontSize: "10px" }
    },
    responsive: {
      rules: [
        {
          condition: { maxWidth: 600 },
          chartOptions: {
            xAxis: {
              labels: { style: { fontSize: "9px" } }
            },
            yAxis: {
              labels: { style: { fontSize: "9px" } }
            },
            legend: {
              itemStyle: { fontSize: "9px" }
            },
            title: {
              style: { fontSize: "14px" }
            }
          }
        }
      ]
    }
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ minWidth: 500 }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default HighChart;
