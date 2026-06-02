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
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";

const payColors = { Pending:"warning", Paid:"success", Failed:"error", Refunded:"default" };

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats]       = useState({ total:0, paid:0, pending:0, revenue:0 });

  useEffect(() => {
    API.get("/requests/payments").then(res => {
      const list = res.data.payments || [];
      setPayments(list);
      setStats({
        total:   list.length,
        paid:    list.filter(p => p.paymentStatus === "Paid").length,
        pending: list.filter(p => p.paymentStatus === "Pending").length,
        revenue: list.filter(p => p.paymentStatus === "Paid").reduce((s, p) => s + p.amount, 0)
      });
    }).catch(() => {});
  }, []);

  const CARDS = [
    { label:"Total Revenue",    value:`₹${stats.revenue.toLocaleString()}`, color:"#c62828" },
    { label:"Paid Requests",    value:stats.paid,    color:"#2e7d32" },
    { label:"Pending Payments", value:stats.pending, color:"#e65100" },
    { label:"Total Payments",   value:stats.total,   color:"#1565c0" },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" fontWeight={700} color="#c62828" gutterBottom>💰 Payment Management</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {CARDS.map(c => (
          <Grid item xs={12} sm={6} md={3} key={c.label}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, borderLeft: `5px solid ${c.color}` }}>
              <Typography variant="caption" color="text.secondary">{c.label}</Typography>
              <Typography variant="h4" fontWeight={800} color={c.color}>{c.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#ffebee" }}>
              {["Hospital","Blood Group","Qty","Amount","Method","Transaction ID","Status","Date"].map(h => (
                <TableCell key={h}><b>{h}</b></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map(p => (
              <TableRow key={p._id} hover>
                <TableCell>{p.hospitalId?.hospitalName || p.requestId?.hospitalId?.hospitalName || "-"}</TableCell>
                <TableCell><b style={{ color:"#c62828" }}>{p.requestId?.bloodGroup || "-"}</b></TableCell>
                <TableCell>{p.requestId?.quantity || "-"}</TableCell>
                <TableCell><b>₹{p.amount?.toLocaleString()}</b></TableCell>
                <TableCell>{p.paymentMethod || "-"}</TableCell>
                <TableCell><Typography variant="caption" fontFamily="monospace">{p.transactionId || "-"}</Typography></TableCell>
                <TableCell><Chip label={p.paymentStatus} color={payColors[p.paymentStatus] || "default"} size="small" /></TableCell>
                <TableCell>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}</TableCell>
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}>No payments yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}