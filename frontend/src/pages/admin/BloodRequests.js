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
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

const statusColors = {
  Pending: "warning",
  Approved: "success",
  Rejected: "error",
  Dispatched: "info",
  Completed: "default"
};

const BloodRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const fetchRequests = () =>
    API.get("/requests")
      .then(res => setRequests(res.data.requests || []))
      .catch(() => setRequests([]));

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id, status) => {
    try {
      setLoadingId(`${id}-${status}`);
      setError("");
      setSuccess("");
      await API.put(`/requests/${id}/status`, { status });
      setSuccess(`Request ${status.toLowerCase()} successfully.`);
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 32, marginBottom: 32 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" style={{ color: "#c62828", fontWeight: 700 }}>📋 Blood Requests</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>{success}</Alert>}

      <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
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
              <TableRow key={r._id} hover>
                <TableCell>{r.hospitalId?.hospitalName || "-"}</TableCell>
                <TableCell><b style={{ color: "#c62828" }}>{r.bloodGroup}</b></TableCell>
                <TableCell>{r.quantity}</TableCell>
                <TableCell>
                  {r.emergency
                    ? <Chip label="URGENT" color="error" size="small" />
                    : <Typography variant="body2" color="text.secondary">No</Typography>}
                </TableCell>
                <TableCell>{r.reason || "-"}</TableCell>
                <TableCell>
                  <Chip label={r.status} color={statusColors[r.status] || "default"} size="small" />
                </TableCell>
                <TableCell>
                  {r.status === "Pending" && (
                    <>
                      <Button size="small" color="success" variant="text"
                        disabled={loadingId === `${r._id}-Approved`}
                        onClick={() => updateStatus(r._id, "Approved")}
                        sx={{ mr: 1, fontWeight: 700 }}>
                        {loadingId === `${r._id}-Approved` ? "..." : "Approve"}
                      </Button>
                      <Button size="small" color="error" variant="text"
                        disabled={loadingId === `${r._id}-Rejected`}
                        onClick={() => updateStatus(r._id, "Rejected")}
                        sx={{ fontWeight: 700 }}>
                        {loadingId === `${r._id}-Rejected` ? "..." : "Reject"}
                      </Button>
                    </>
                  )}
                  {r.status === "Approved" && (
                    <Button size="small" color="info" variant="text"
                      disabled={loadingId === `${r._id}-Dispatched`}
                      onClick={() => updateStatus(r._id, "Dispatched")}
                      sx={{ fontWeight: 700 }}>
                      {loadingId === `${r._id}-Dispatched` ? "..." : "Dispatch"}
                    </Button>
                  )}
                  {r.status === "Dispatched" && (
                    <Button size="small" variant="text"
                      disabled={loadingId === `${r._id}-Completed`}
                      onClick={() => updateStatus(r._id, "Completed")}
                      sx={{ fontWeight: 700 }}>
                      {loadingId === `${r._id}-Completed` ? "..." : "Complete"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No blood requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default BloodRequests;
