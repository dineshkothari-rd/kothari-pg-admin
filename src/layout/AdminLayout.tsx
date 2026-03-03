import { Box, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <Topbar />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f6f9fc, #eef2ff)",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
