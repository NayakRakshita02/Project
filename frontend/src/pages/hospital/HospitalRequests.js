//frontend/src/pages/hospital/HospitalRequests.js

import React, { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";

const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const statusColors = { Pending: "warning", Approved: "success", Rejected: "error", Dispatched: "info", Completed: "default" };

const HospitalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ bloodGroup: "A+", quantity: "", emergency: false, reason: "" });
  const [error, setError] = useState("");

  const fetchRequests = () => API.get("/requests/mine").then(res => setRequests(res.data.requests));
  useEffect(() => { fetchRequests(); }, []);

  const handleSubmit = async () => {
    setError("");
    try {
      await API.post("/requests", form);
      setOpen(false);
      setForm({ bloodGroup: "A+", quantity: "", emergency: false, reason: "" });
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send request");
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 32 }}>
      <Typography variant="h5" gutterBottom style={{ color: "#c62828" }}>📋 Blood Requests</Typography>
      <Button variant="contained" onClick={() => setOpen(true)}
        style={{ backgroundColor: "#c62828", marginBottom: 16 }}>+ New Request</Button>

      <Paper>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#ffebee" }}>
              <TableCell><b>Blood Group</b></TableCell>
              <TableCell><b>Quantity</b></TableCell>
              <TableCell><b>Emergency</b></TableCell>
              <TableCell><b>Reason</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Date</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map(r => (
              <TableRow key={r._id}>
                <TableCell><b style={{ color: "#c62828" }}>{r.bloodGroup}</b></TableCell>
                <TableCell>{r.quantity}</TableCell>
                <TableCell>{r.emergency ? <Chip label="URGENT" color="error" size="small" /> : "No"}</TableCell>
                <TableCell>{r.reason || "-"}</TableCell>
                <TableCell><Chip label={r.status} color={statusColors[r.status] || "default"} size="small" /></TableCell>
                <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>New Blood Request</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" style={{ marginBottom: 12 }}>{error}</Alert>}
          <FormControl fullWidth margin="normal">
            <InputLabel>Blood Group</InputLabel>
            <Select value={form.bloodGroup} label="Blood Group"
              onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
              {BLOOD_GROUPS.map(bg => <MenuItem key={bg} value={bg}>{bg}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="Quantity" type="number" margin="normal"
            value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
          <TextField fullWidth label="Reason" margin="normal"
            value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
          <FormControlLabel
            control={<Switch checked={form.emergency}
              onChange={e => setForm({ ...form, emergency: e.target.checked })} color="error" />}
            label="Mark as Emergency" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}
            style={{ backgroundColor: "#c62828" }}>Submit Request</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HospitalRequests;