import Grid from "@mui/material/Grid";
import { Paper, Typography, Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import BedIcon from "@mui/icons-material/Bed";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PaymentsIcon from "@mui/icons-material/Payments";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { name: "Collected", value: 95000 },
  { name: "Due", value: 40000 },
];

const COLORS = ["#10b981", "#ef4444"];

const stats = [
  {
    label: "Total Students",
    value: 18,
    icon: <PeopleIcon fontSize="large" />,
    gradient: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  {
    label: "Total Seats",
    value: 24,
    icon: <BedIcon fontSize="large" />,
    gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
  },
  {
    label: "Vacant Seats",
    value: 6,
    icon: <MeetingRoomIcon fontSize="large" />,
    gradient: "linear-gradient(135deg, #f7971e, #ffd200)",
  },
  {
    label: "Total Fees",
    value: "₹1,35,000",
    icon: <PaymentsIcon fontSize="large" />,
    gradient: "linear-gradient(135deg, #fc466b, #3f5efb)",
  },
];

export default function Dashboard() {
  return (
    <>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {stats.map((item, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                color: "#fff",
                background: item.gradient,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                minHeight: 120,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box>
                <Typography variant="subtitle2">{item.label}</Typography>

                <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                  {item.value}
                </Typography>
              </Box>

              <Box
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: 3,
                  p: 1.5,
                }}
              >
                {item.icon}
              </Box>
            </Paper>
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
        <Typography variant="h6" fontWeight={600} mb={2}>
          Revenue Breakdown
        </Typography>

        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={revenueData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </>
  );
}
