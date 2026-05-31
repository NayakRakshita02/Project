import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Inventory from "./pages/admin/Inventory";
import Donors from "./pages/admin/Donors";
import Hospitals from "./pages/admin/Hospitals";
import BloodRequests from "./pages/admin/BloodRequests";
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import HospitalRequests from "./pages/hospital/HospitalRequests";
import HospitalInventory from "./pages/hospital/HospitalInventory";
import DonorDashboard from "./pages/donor/DonorDashboard";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/inventory" element={<PrivateRoute role="admin"><Inventory /></PrivateRoute>} />
          <Route path="/admin/donors" element={<PrivateRoute role="admin"><Donors /></PrivateRoute>} />
          <Route path="/admin/hospitals" element={<PrivateRoute role="admin"><Hospitals /></PrivateRoute>} />
          <Route path="/admin/requests" element={<PrivateRoute role="admin"><BloodRequests /></PrivateRoute>} />

          <Route path="/hospital" element={<PrivateRoute role="hospital"><HospitalDashboard /></PrivateRoute>} />
          <Route path="/hospital/requests" element={<PrivateRoute role="hospital"><HospitalRequests /></PrivateRoute>} />
          <Route path="/hospital/inventory" element={<PrivateRoute role="hospital"><HospitalInventory /></PrivateRoute>} />

          <Route path="/donor" element={<PrivateRoute role="donor"><DonorDashboard /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;