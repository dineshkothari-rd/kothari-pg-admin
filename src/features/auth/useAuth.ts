import { useNavigate } from "react-router-dom";
import { login, logout } from "./auth.service";

export function useAuth() {
  const navigate = useNavigate();

  const handleLogin = (email: string, password: string) => {
    const success = login({ email, password });

    if (success) {
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return {
    handleLogin,
    handleLogout,
  };
}
