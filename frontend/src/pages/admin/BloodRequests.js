//frontend/src/pages/admin/BloodRequests.js

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

const statusColors = {
  Pending: "warning", Approved: "success", Rejected: "error",
  Dispatched: "info", Completed: "default"
};

const BloodRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = () => API.get("/requests").then(res => setRequests(res.data.requests));
  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/requests/${id}/status`, { status });
    fetchRequests();
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 32 }}>
      <Typography variant="h5" gutterBottom style={{ color: "#c62828" }}>📋 Blood Requests</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#ffebee" }}>
              <TableCell><b>Hospital</b></TableCell>
              <TableCell><b>Blood Group</b></TableCell>
              <TableCell><b>Quantity</b></TableCell>
              <TableCell><b>Emergency</b></TableCell>
              <TableCell><b>Reason</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map(r => (
              <TableRow key={r._id}>
                <TableCell>{r.hospitalId?.hospitalName}</TableCell>
                <TableCell><b style={{ color: "#c62828" }}>{r.bloodGroup}</b></TableCell>
                <TableCell>{r.quantity}</TableCell>
                <TableCell>
                  {r.emergency ? <Chip label="URGENT" color="error" size="small" /> : "No"}
                </TableCell>
                <TableCell>{r.reason || "-"}</TableCell>
                <TableCell>
                  <Chip label={r.status} color={statusColors[r.status] || "default"} size="small" />
                </TableCell>
                <TableCell>
                  {r.status === "Pending" && (
                    <>
                      <Button size="small" color="success" onClick={() => updateStatus(r._id, "Approved")}
                        style={{ marginRight: 4 }}>Approve</Button>
                      <Button size="small" color="error" onClick={() => updateStatus(r._id, "Rejected")}>Reject</Button>
                    </>
                  )}
                  {r.status === "Approved" && (
                    <Button size="small" color="info" onClick={() => updateStatus(r._id, "Dispatched")}>Dispatch</Button>
                  )}
                  {r.status === "Dispatched" && (
                    <Button size="small" onClick={() => updateStatus(r._id, "Completed")}>Complete</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default BloodRequests;