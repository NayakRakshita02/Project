//frontend/src/pages/Register.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Alert from "@mui/material/Alert";

const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

const Register = () => {
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"donor",
    bloodGroup:"A+", age:"", gender:"Male", phone:"", address:"",
    hospitalName:"", licenseNumber:"" });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await register(form);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: 40 }}>
      <Paper style={{ padding: 32 }}>
        <Typography variant="h5" gutterBottom style={{ color: "#c62828", textAlign: "center" }}>
          🩸 Register
        </Typography>
        {error && <Alert severity="error" style={{ marginBottom: 16 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Full Name" margin="normal" required
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth label="Email" type="email" margin="normal" required
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <TextField fullWidth label="Password" type="password" margin="normal" required
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select value={form.role} label="Role" onChange={e => setForm({ ...form, role: e.target.value })}>
              <MenuItem value="donor">Donor</MenuItem>
              <MenuItem value="hospital">Hospital</MenuItem>
            </Select>
          </FormControl>

          {form.role === "donor" && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Blood Group</InputLabel>
                <Select value={form.bloodGroup} label="Blood Group"
                  onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                  {BLOOD_GROUPS.map(bg => <MenuItem key={bg} value={bg}>{bg}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField fullWidth label="Age" type="number" margin="normal"
                value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select value={form.gender} label="Gender"
                  onChange={e => setForm({ ...form, gender: e.target.value })}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField fullWidth label="Phone" margin="normal"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <TextField fullWidth label="Address" margin="normal"
                value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </>
          )}

          {form.role === "hospital" && (
            <>
              <TextField fullWidth label="Hospital Name" margin="normal" required
                value={form.hospitalName} onChange={e => setForm({ ...form, hospitalName: e.target.value })} />
              <TextField fullWidth label="License Number" margin="normal" required
                value={form.licenseNumber} onChange={e => setForm({ ...form, licenseNumber: e.target.value })} />
              <TextField fullWidth label="Phone" margin="normal"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <TextField fullWidth label="Address" margin="normal"
                value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </>
          )}

          <Button fullWidth variant="contained" type="submit"
            style={{ marginTop: 16, backgroundColor: "#c62828" }}>Register</Button>
        </form>
        <Typography style={{ marginTop: 16, textAlign: "center" }}>
          Already registered? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;