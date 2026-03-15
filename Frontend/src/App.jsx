import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ChooseRole from "./pages/ChooseRole.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import DeveloperDashboard from "./pages/DeveloperDashboard.jsx";
import ReporterDashboard from "./pages/ReporterDashboard.jsx";

function App() {
  const { token, role } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/choose-role" element={<ChooseRole />} />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            token && role === "administrator"
              ? <AdminDashboard />
              : token && role === "pending"
                ? <Navigate to="/choose-role" />
              : <Navigate to="/" />
          }
        />

        {/* Developer Route */}
        <Route
          path="/developer"
          element={
            token && role === "developer"
              ? <DeveloperDashboard />
              : token && role === "pending"
                ? <Navigate to="/choose-role" />
              : <Navigate to="/" />
          }
        />

        {/* Reporter Route */}
        <Route
          path="/reporter"
          element={
            token && role === "reporter"
              ? <ReporterDashboard />
              : token && role === "pending"
                ? <Navigate to="/choose-role" />
              : <Navigate to="/" />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;