import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export default function Topbar() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        color: "#111",
        borderBottom: "1px solid #e5e7eb",
        zIndex: 1201,
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight={600}>
          Admin Dashboard
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Typography variant="body2">Welcome, Admin</Typography>
      </Toolbar>
    </AppBar>
  );
}
