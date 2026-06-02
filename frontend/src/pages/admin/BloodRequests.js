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
import Tooltip from "@mui/material/Tooltip";

const reqColors = { Pending:"warning", Approved:"info", Rejected:"error", "Payment Pending":"warning", Paid:"success", Dispatched:"info", Completed:"default" };
const payColors = { Pending:"warning", Paid:"success", Failed:"error", Refunded:"default" };

export default function BloodRequests() {
  const [requests, setRequests]   = useState([]);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const fetch = () => API.get("/requests").then(r => setRequests(r.data.requests || [])).catch(() => {});
  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id, status) => {
    try {
      setLoadingId(`${id}-${status}`); setError(""); setSuccess("");
      await API.put(`/requests/${id}/status`, { status });
      setSuccess(`Request marked as ${status}.`);
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update");
    } finally { setLoadingId(null); }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" fontWeight={700} color="#c62828" gutterBottom>📋 Blood Requests</Typography>
      {error   && <Alert severity="error"   sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>{success}</Alert>}

      <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#ffebee" }}>
              {["Hospital","Blood Group","Qty","Amount","Emergency","Reason","Request Status","Payment","Actions"].map(h => (
                <TableCell key={h}><b>{h}</b></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map(r => (
              <TableRow key={r._id} hover>
                <TableCell>{r.hospitalId?.hospitalName || "-"}</TableCell>
                <TableCell><b style={{ color: "#c62828" }}>{r.bloodGroup}</b></TableCell>
                <TableCell>{r.quantity}</TableCell>
                <TableCell>₹{r.amount?.toLocaleString()}</TableCell>
                <TableCell>{r.emergency ? <Chip label="URGENT" color="error" size="small" /> : "No"}</TableCell>
                <TableCell>{r.reason || "-"}</TableCell>
                <TableCell><Chip label={r.requestStatus} color={reqColors[r.requestStatus] || "default"} size="small" /></TableCell>
                <TableCell><Chip label={r.paymentStatus || "Pending"} color={payColors[r.paymentStatus] || "default"} size="small" /></TableCell>
                <TableCell>
                  {r.requestStatus === "Pending" && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button size="small" color="success" variant="text"
                        disabled={loadingId === `${r._id}-Approved`}
                        onClick={() => updateStatus(r._id, "Approved")}>
                        {loadingId === `${r._id}-Approved` ? "..." : "Approve"}
                      </Button>
                      <Button size="small" color="error" variant="text"
                        disabled={loadingId === `${r._id}-Rejected`}
                        onClick={() => updateStatus(r._id, "Rejected")}>
                        {loadingId === `${r._id}-Rejected` ? "..." : "Reject"}
                      </Button>
                    </Box>
                  )}
                  {r.requestStatus === "Paid" && (
                    <Button size="small" color="info" variant="text"
                      disabled={loadingId === `${r._id}-Dispatched`}
                      onClick={() => updateStatus(r._id, "Dispatched")}>
                      {loadingId === `${r._id}-Dispatched` ? "..." : "Dispatch"}
                    </Button>
                  )}
                  {r.requestStatus === "Approved" && r.paymentStatus !== "Paid" && (
                    <Tooltip title="Waiting for hospital to complete payment">
                      <span><Button size="small" color="info" variant="text" disabled>Dispatch</Button></span>
                    </Tooltip>
                  )}
                  {r.requestStatus === "Dispatched" && (
                    <Button size="small" variant="text"
                      disabled={loadingId === `${r._id}-Completed`}
                      onClick={() => updateStatus(r._id, "Completed")}>
                      {loadingId === `${r._id}-Completed` ? "..." : "Complete"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {requests.length === 0 && (
              <TableRow><TableCell colSpan={9} align="center" sx={{ py: 4, color: "text.secondary" }}>No blood requests found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}