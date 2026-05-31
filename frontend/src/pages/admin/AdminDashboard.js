//frontend/src/pages/admin/AdminDashboard.js

import React, { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import StatCard from "../../components/StatCard";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/analytics/dashboard").then(res => setStats(res.data.stats));
  }, []);

  if (!stats) return <div style={{ textAlign: "center", marginTop: 80 }}>Loading dashboard...</div>;

  const chartData = stats.bloodGroupSummary.map(item => ({ name: item._id, units: item.total }));

  return (
    <Container maxWidth="lg" style={{ marginTop: 32 }}>
      <Typography variant="h4" gutterBottom style={{ color: "#c62828" }}>
        🩸 Admin Dashboard
      </Typography>

      <Grid container spacing={3} style={{ marginBottom: 32 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Donors" value={stats.totalDonors} color="#e53935" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Hospitals" value={stats.totalHospitals} color="#1e88e5" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Blood Units" value={stats.totalBloodUnits} color="#43a047" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Requests" value={stats.pendingRequests} color="#fb8c00" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Emergency Requests" value={stats.emergencyRequests} color="#c62828" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Expiring Soon" value={stats.expiringSoon} color="#7b1fa2" />
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginBottom: 24 }}>
        {[
          { label: "Inventory", path: "/admin/inventory" },
          { label: "Donors", path: "/admin/donors" },
          { label: "Hospitals", path: "/admin/hospitals" },
          { label: "Blood Requests", path: "/admin/requests" },
        ].map(({ label, path }) => (
          <Grid item key={label}>
            <Button variant="outlined" onClick={() => navigate(path)}
              style={{ borderColor: "#c62828", color: "#c62828" }}>
              {label}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Paper style={{ padding: 24 }}>
        <Typography variant="h6" gutterBottom>Blood Group Distribution</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="units" fill="#c62828" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;