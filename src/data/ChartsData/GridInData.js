// src/data/solarData.js
import dayjs from "dayjs";

// Function to generate dummy solar data
export const generateDummyData = (startDate, endDate) => {
  const data = [];
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const daysDiff = end.diff(start, "day");

  for (let day = 0; day <= daysDiff; day++) {
    const currentDay = start.add(day, "day");

    // Generate data points every 30 minutes
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timestamp = currentDay
          .hour(hour)
          .minute(minute)
          .valueOf();

        // Solar power production (active between 6 AM - 6 PM)
        const solarProduction = hour >= 6 && hour <= 18
          ? Math.abs(Math.sin((hour - 6) * Math.PI / 12)) * 1000 + Math.random() * 200
          : 0;

        data.push([timestamp, Math.round(solarProduction)]);
      }
    }
  }

  return [
    {
      name: "Grid In",
      data: data.sort((a, b) => a[0] - b[0]), // Sort data by time
    },
  ];
};
