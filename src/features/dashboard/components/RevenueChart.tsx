import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { RevenueItem } from "../types/dashboard.types";

interface Props {
  data: RevenueItem[];
  colors: string[];
}

export default function RevenueChart({ data, colors }: Props) {
  return (
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
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={100}>
              {data.map((_, index) => (
                <Cell key={index} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
