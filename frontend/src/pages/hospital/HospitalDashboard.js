//frontend/src/pages/hospital/HospitalDashboard.js


import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container maxWidth="md" style={{ marginTop: 48 }}>
      <Typography variant="h4" gutterBottom style={{ color: "#c62828" }}>
        🏥 Hospital Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>Welcome, {user?.name}</Typography>
      <Grid container spacing={3} style={{ marginTop: 16 }}>
        {[
          { label: "📦 View Blood Inventory", path: "/hospital/inventory" },
          { label: "📋 My Blood Requests", path: "/hospital/requests" },
        ].map(({ label, path }) => (
          <Grid item xs={12} sm={6} key={label}>
            <Paper style={{ padding: 32, textAlign: "center" }}>
              <Button variant="contained" onClick={() => navigate(path)}
                style={{ backgroundColor: "#c62828" }} size="large">
                {label}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HospitalDashboard;


