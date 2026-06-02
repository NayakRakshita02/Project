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
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Switch from "@mui/material/Switch";
import { FormHelperText } from "@mui/material";

const reqColors = {
  Pending: "warning",
  Approved: "info",
  Rejected: "error",
  "Payment Pending": "warning",
  Paid: "success",
  Dispatched: "info",
  Completed: "default",
};

const payColors = {
  Pending: "warning",
  Paid: "success",
  Failed: "error",
  Refunded: "default",
};

const METHODS = ["UPI", "Credit Card", "Debit Card", "Net Banking"];
const BLOOD_COMPONENTS = ["Whole Blood", "Plasma", "Platelets"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const initialForm = {
  bloodGroup: "A+",
  quantity: "",
  component: "Whole Blood",
  emergency: false,
  reason: "",
};

export default function HospitalRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [payDialog, setPayDialog] = useState(null);
  const [method, setMethod] = useState("UPI");
  const [txnResult, setTxnResult] = useState(null);
  const [paying, setPaying] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [component, setComponent] = useState("Whole Blood");

  const fetch = () =>
    API.get("/requests/mine")
      .then((r) => setRequests(r.data.requests || []))
      .catch(() => {});

  useEffect(() => {
    fetch();
  }, []);

  const resetForm = () => setForm(initialForm);

  const handleSubmit = async () => {
    try {
      setError("");
      setSuccess("");
      await API.post("/requests", form);
      setSuccess("Request created successfully.");
      setOpen(false);
      resetForm();
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to send request");
    }
  };

  const openPay = (r) => {
    setPayDialog(r);
    setMethod("UPI");
    setTxnResult(null);
    setUpiId("");
    setCardNum("");
    setCardName("");
    setCardExp("");
    setCardCvv("");
    setComponent(r?.component || "Whole Blood");
  };

  const closePay = () => {
    setPayDialog(null);
    setTxnResult(null);
  };

  const submitPayment = async () => {
    try {
      setPaying(true);
      setError("");
      const res = await API.post(`/requests/${payDialog._id}/pay`, {
        paymentMethod: method,
        component,
      });
      setTxnResult(res.data.transactionId);
      setSuccess(`Payment successful! Transaction ID: ${res.data.transactionId}`);
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, gap: 2, flexWrap: "wrap" }}>
        <Typography variant="h5" fontWeight={700} color="#c62828">
          🏥 My Blood Requests
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ backgroundColor: "#c62828", fontWeight: 700 }}
        >
          + New Request
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>{success}</Alert>}

      <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#ffebee" }}>
              {["Blood Group", "Qty", "Amount", "Component", "Emergency", "Reason", "Request Status", "Payment Status", "Action"].map((h) => (
                <TableCell key={h}><b>{h}</b></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((r) => (
              <TableRow key={r._id} hover>
                <TableCell><b style={{ color: "#c62828" }}>{r.bloodGroup}</b></TableCell>
                <TableCell>{r.quantity}</TableCell>
                <TableCell><b>₹{r.amount?.toLocaleString()}</b></TableCell>
                <TableCell>{r.component || "Whole Blood"}</TableCell>
                <TableCell>{r.emergency ? <Chip label="URGENT" color="error" size="small" /> : "No"}</TableCell>
                <TableCell>{r.reason || "-"}</TableCell>
                <TableCell><Chip label={r.requestStatus} color={reqColors[r.requestStatus] || "default"} size="small" /></TableCell>
                <TableCell><Chip label={r.paymentStatus || "Pending"} color={payColors[r.paymentStatus] || "default"} size="small" /></TableCell>
                <TableCell>
                  {r.requestStatus === "Approved" && r.paymentStatus !== "Paid" && (
                    <Button variant="contained" size="small" sx={{ backgroundColor: "#c62828", fontWeight: 700, borderRadius: 2 }} onClick={() => openPay(r)}>
                      Pay Now
                    </Button>
                  )}
                  {r.paymentStatus === "Paid" && r.paymentId?.transactionId && (
                    <Typography variant="caption" color="text.secondary">TXN: {r.paymentId.transactionId}</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>No requests found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* New Request Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>New Blood Request</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <FormControl fullWidth>
              <InputLabel>Blood Group</InputLabel>
              <Select
                value={form.bloodGroup}
                label="Blood Group"
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
              >
                {BLOOD_GROUPS.map((bg) => (
                  <MenuItem key={bg} value={bg}>{bg}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Blood Component</InputLabel>
              <Select
                value={form.component}
                label="Blood Component"
                onChange={(e) => setForm({ ...form, component: e.target.value })}
              >
                {BLOOD_COMPONENTS.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Used for amount calculation on the backend.</FormHelperText>
            </FormControl>

            <TextField
              fullWidth
              // label="Quantity"
              label="Quantity (Units)"
              helperText="Enter number of blood units, not millilitres."
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />

            <TextField
              fullWidth
              label="Reason"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={form.emergency}
                  onChange={(e) => setForm({ ...form, emergency: e.target.checked })}
                  color="error"
                />
              }
              label="Mark as Emergency"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: "#c62828" }}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={!!payDialog} onClose={closePay} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>💳 Complete Payment</DialogTitle>
        <DialogContent dividers>
          {txnResult ? (
            <Box textAlign="center" py={3}>
              <Typography variant="h2" mb={1}>✅</Typography>
              <Typography variant="h6" fontWeight={700} color="success.main">Payment Successful!</Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>Transaction ID: <b>{txnResult}</b></Typography>
              <Typography variant="body2" color="text.secondary">Method: <b>{method}</b></Typography>
            </Box>
          ) : (
            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography color="text.secondary">Blood Group</Typography>
                <Typography fontWeight={700} color="#c62828">{payDialog?.bloodGroup}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography color="text.secondary">Quantity</Typography>
                <Typography fontWeight={700}>{payDialog?.quantity} units</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography color="text.secondary">Component</Typography>
                <Typography fontWeight={700}>{payDialog?.component || component}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography color="text.secondary">Total Amount</Typography>
                <Typography fontWeight={800} fontSize="1.2rem" color="#c62828">₹{payDialog?.amount?.toLocaleString()}</Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />

              <Typography fontWeight={700} mb={1}>Blood Component</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                1 unit means one donation bag (about 350–450 ml for component-based display).
              </Typography>
              <RadioGroup value={component} onChange={(e) => setComponent(e.target.value)} row sx={{ mb: 2 }}>
                {BLOOD_COMPONENTS.map((c) => <FormControlLabel key={c} value={c} control={<Radio />} label={c} />)}
              </RadioGroup>

              <Typography fontWeight={700} mb={1}>Select Payment Method</Typography>
              <RadioGroup value={method} onChange={(e) => setMethod(e.target.value)} row>
                {METHODS.map((m) => <FormControlLabel key={m} value={m} control={<Radio />} label={m} />)}
              </RadioGroup>

              <Box mt={3}>
                {method === "UPI" && (
                  <TextField fullWidth label="UPI ID" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                )}
                {(method === "Credit Card" || method === "Debit Card") && (
                  <Stack spacing={2}>
                    <TextField fullWidth label="Card Holder Name" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                    <TextField fullWidth label="Card Number" inputProps={{ maxLength: 19 }} value={cardNum} onChange={(e) => setCardNum(e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim())} />
                    <Stack direction="row" spacing={2}>
                      <TextField fullWidth label="Expiry (MM/YY)" value={cardExp} onChange={(e) => setCardExp(e.target.value)} />
                      <TextField fullWidth label="CVV" type="password" inputProps={{ maxLength: 3 }} value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} />
                    </Stack>
                  </Stack>
                )}
                {method === "Net Banking" && <Alert severity="info">You will be redirected to your bank portal (simulated).</Alert>}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closePay}>{txnResult ? "Close" : "Cancel"}</Button>
          {!txnResult && (
            <Button variant="contained" onClick={submitPayment} disabled={paying} sx={{ backgroundColor: "#c62828", fontWeight: 700 }}>
              {paying ? "Processing..." : `Pay ₹${payDialog?.amount?.toLocaleString()}`}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}