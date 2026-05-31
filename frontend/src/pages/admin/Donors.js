//frontend/src/pages/admin/Donors.js

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

const BLOOD_GROUPS = ["", "A+","A-","B+","B-","AB+","AB-","O+","O-"];

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [bloodGroup, setBloodGroup] = useState("");
  const [search, setSearch] = useState("");

  const fetchDonors = () => {
    const params = {};
    if (bloodGroup) params.bloodGroup = bloodGroup;
    if (search) params.search = search;
    API.get("/donors", { params }).then(res => setDonors(res.data.donors));
  };

  useEffect(() => { fetchDonors(); }, [bloodGroup, search]);

  const handleDelete = async (id) => {
    if (window.confirm("Remove this donor?")) {
      await API.delete(`/donors/${id}`);
      fetchDonors();
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 32 }}>
      <Typography variant="h5" gutterBottom style={{ color: "#c62828" }}>🩸 Donor Management</Typography>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <TextField label="Search by name" value={search} onChange={e => setSearch(e.target.value)} size="small" />
        <FormControl size="small" style={{ minWidth: 140 }}>
          <InputLabel>Blood Group</InputLabel>
          <Select value={bloodGroup} label="Blood Group" onChange={e => setBloodGroup(e.target.value)}>
            {BLOOD_GROUPS.map(bg => <MenuItem key={bg} value={bg}>{bg || "All"}</MenuItem>)}
          </Select>
        </FormControl>
      </div>

      <Paper>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#ffebee" }}>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Blood Group</b></TableCell>
              <TableCell><b>Age</b></TableCell>
              <TableCell><b>Gender</b></TableCell>
              <TableCell><b>Phone</b></TableCell>
              <TableCell><b>Last Donation</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donors.map(d => (
              <TableRow key={d._id}>
                <TableCell>{d.name}</TableCell>
                <TableCell><b style={{ color: "#c62828" }}>{d.bloodGroup}</b></TableCell>
                <TableCell>{d.age}</TableCell>
                <TableCell>{d.gender}</TableCell>
                <TableCell>{d.phone}</TableCell>
                <TableCell>{d.lastDonationDate ? new Date(d.lastDonationDate).toLocaleDateString() : "N/A"}</TableCell>
                <TableCell>
                  <Button size="small" color="error" onClick={() => handleDelete(d._id)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Donors;