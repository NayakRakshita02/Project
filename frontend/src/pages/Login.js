//frontend/src/pages/Login.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(form.email, form.password);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: 80 }}>
      <Paper style={{ padding: 32 }}>
        <Typography variant="h5" gutterBottom style={{ color: "#c62828", textAlign: "center" }}>🩸 Blood Bank Login</Typography>
        {error && <Alert severity="error" style={{ marginBottom: 16 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" type="email" margin="normal" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <TextField fullWidth label="Password" type="password" margin="normal" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <Button fullWidth variant="contained" type="submit" style={{ marginTop: 16, backgroundColor: "#c62828" }}>Login</Button>
        </form>
        <Typography style={{ marginTop: 16, textAlign: "center" }}>New here? <Link to="/register">Register</Link></Typography>
      </Paper>
    </Container>
  );
};

export default Login;