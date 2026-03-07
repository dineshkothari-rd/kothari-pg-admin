import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import Login from "../features/auth/Login";
import Dashboard from "../features/dashboard/Dashboard";
import Students from "../features/students/Students";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
