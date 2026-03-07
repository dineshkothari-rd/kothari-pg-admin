import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import RevenueChart from "./components/RevenueChart";
import StatCard from "./components/StatCard";
import { COLORS, revenueData, stats } from "./constants/dashboardData";

export default function Dashboard() {
  return (
    <>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        {stats.map((item, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard item={item} />
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 4,
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <RevenueChart data={revenueData} colors={COLORS} />
      </Box>
    </>
  );
}
