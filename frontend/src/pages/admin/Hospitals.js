//frontend/src/pages/admin/Hospitals.js

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
import Chip from "@mui/material/Chip";

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);

  const fetchHospitals = () => API.get("/hospitals").then(res => setHospitals(res.data.hospitals));
  useEffect(() => { fetchHospitals(); }, []);

  const handleApprove = async (id) => {
    await API.put(`/hospitals/approve/${id}`);
    fetchHospitals();
  };

  const handleReject = async (id) => {
    if (window.confirm("Reject and remove this hospital?")) {
      await API.delete(`/hospitals/reject/${id}`);
      fetchHospitals();
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 32 }}>
      <Typography variant="h5" gutterBottom style={{ color: "#c62828" }}>🏥 Hospital Management</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#ffebee" }}>
              <TableCell><b>Hospital Name</b></TableCell>
              <TableCell><b>License</b></TableCell>
              <TableCell><b>Phone</b></TableCell>
              <TableCell><b>Address</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hospitals.map(h => (
              <TableRow key={h._id}>
                <TableCell>{h.hospitalName}</TableCell>
                <TableCell>{h.licenseNumber}</TableCell>
                <TableCell>{h.phone}</TableCell>
                <TableCell>{h.address}</TableCell>
                <TableCell>
                  <Chip label={h.approved ? "Approved" : "Pending"}
                    color={h.approved ? "success" : "warning"} size="small" />
                </TableCell>
                <TableCell>
                  {!h.approved && (
                    <Button size="small" color="success" onClick={() => handleApprove(h._id)}
                      style={{ marginRight: 8 }}>Approve</Button>
                  )}
                  <Button size="small" color="error" onClick={() => handleReject(h._id)}>Reject</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Hospitals;