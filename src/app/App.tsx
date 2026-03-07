import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

import Dashboard from "../features/dashboard/Dashboard";
import Students from "../features/students/Students";

import Login from "../features/auth/Login";
import ProtectedRoute from "../features/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
