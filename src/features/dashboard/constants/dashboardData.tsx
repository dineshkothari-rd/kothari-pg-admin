import PeopleIcon from "@mui/icons-material/People";
import BedIcon from "@mui/icons-material/Bed";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PaymentsIcon from "@mui/icons-material/Payments";
import type { RevenueItem, StatItem } from "../types/dashboard.types";

export const stats: StatItem[] = [
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
    value: 135000,
    icon: <PaymentsIcon fontSize="large" />,
    gradient: "linear-gradient(135deg, #fc466b, #3f5efb)",
  },
];

export const revenueData: RevenueItem[] = [
  { name: "Collected", value: 95000 },
  { name: "Due", value: 40000 },
];

export const COLORS = ["#10b981", "#ef4444"];
