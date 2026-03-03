import Grid from "@mui/material/Grid";
import { Paper, Typography, Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import BedIcon from "@mui/icons-material/Bed";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PaymentsIcon from "@mui/icons-material/Payments";

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
    </>
  );
}
