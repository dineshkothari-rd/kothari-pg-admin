import { Paper, Typography, Box } from "@mui/material";
import CountUp from "react-countup";
import type { StatItem } from "../types/dashboard.types";

interface Props {
  item: StatItem;
}

export default function StatCard({ item }: Props) {
  return (
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
          <CountUp end={item.value} duration={1.2} />
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
  );
}
