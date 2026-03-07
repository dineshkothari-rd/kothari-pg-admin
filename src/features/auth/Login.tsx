import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "./useAuth";
import { loginWithGoogle } from "./googleLogin";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <Paper sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" mb={3}>
          Admin Login
        </Typography>

        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={() => handleLogin(email, password)}
          sx={{ mb: 3 }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={async () => {
            const user = await loginWithGoogle();

            if (user) {
              localStorage.setItem("auth_token", user.uid);
              navigate("/");
            }
          }}
        >
          Sign in with Google
        </Button>
      </Paper>
    </Box>
  );
}
