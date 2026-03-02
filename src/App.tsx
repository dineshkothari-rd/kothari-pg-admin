import { Button, Container, Typography } from "@mui/material";
import "./App.css";

function App() {
  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Kothari PG Admin Dashboard
      </Typography>

      <Button variant="contained">Test Button</Button>
    </Container>
  );
}

export default App;
