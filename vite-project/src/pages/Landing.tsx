//import BasicTabs from "../component/Tabs";
//import Address from "../component/Address";

//export default function Landing() {
//  return (
//    <>
//      <BasicTabs></BasicTabs>
//      <Address></Address>
//    </>
//  );
//}

import { Box, Paper, Typography, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";

function formatStandardTime(hour: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const standardHour = hour % 12 || 12; // Handle 12-hour format
  return `${standardHour}:00 ${period}`;
}

export default function WeatherApp() {
  return (
    <Box sx={{ padding: "16px", height: "100vh", overflow: "auto", background: "gray" }}>
      <Paper sx={{ padding: "16px", marginBottom: "16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4">City Name</Typography>
        <Typography sx={{ fontSize: "48px", fontWeight: "bold", marginBottom: "8px" }}>25°C</Typography>
      </Paper>

      <Paper sx={{ overflowX: "auto", marginBottom: "16px", display: "flex", gap: "8px" }}>
        {/* Horizontal Scrollable Bar */}
        {Array.from({ length: 20 }).map((_, index) => (
          <Paper key={index} sx={{ minWidth: "80px", padding: "8px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography>{formatStandardTime((index + 1) * 2)}</Typography>
            <Typography>{20 + index}°C</Typography>
          </Paper>
        ))}
      </Paper>

      <Paper sx={{ padding: "16px", marginBottom: "16px" }}>
        <Typography variant="h5">10-Day Forecast</Typography>
        <List>
          {Array.from({ length: 10 }).map((_, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <ListItemIcon sx={{ fontSize: "16px" }} />
              </ListItemIcon>
              <ListItemText
                primary={`Day ${index + 1}`}
                secondary={`High: ${25 + index}°C, Low: ${15 + index}°C`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper sx={{ padding: "16px", marginBottom: "16px" }}>
        <Typography variant="h5">Additional Information</Typography>
        <Typography>Weather Condition: Sunny</Typography>
        <Typography>Feels Like: 28°C</Typography>
        <Typography>Humidity: 65%</Typography>
        <Typography>Wind Speed: 10 km/h</Typography>
        <Typography>Sunrise: 6:00 AM</Typography>
        <Typography>Sunset: 8:00 PM</Typography>
        <Typography>Precipitation Chance: 20%</Typography>
        <Typography>UV Index: 7</Typography>
      </Paper>
    </Box>
  );
}
