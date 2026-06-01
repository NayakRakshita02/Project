//frontend/src/pages/admin/Inventory.js

import React, { useEffect, useMemo, useState } from "react";
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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Alert from "@mui/material/Alert";

const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

// ── Helper: add N days to a YYYY-MM-DD string ──
const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [donors, setDonors] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    bloodGroup: "A+",
    quantity: "",
    collectionDate: "",
    expiryDate: "",
    donorName: "",
    donorPhone: "",
    donorEmail: ""
  });

  const fetchInventory = () =>
    API.get("/inventory")
      .then((res) => setInventory(res.data.inventory || []))
      .catch(() => setInventory([]));

  const fetchDonors = () =>
    API.get("/donors")
      .then((res) => setDonors(res.data.donors || []))
      .catch(() => setDonors([]));

  useEffect(() => {
    fetchInventory();
    fetchDonors();
  }, []);

  const filteredDonors = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return donors;
    return donors.filter((d) =>
      [d.name, d.email, d.phone, d.bloodGroup]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [donors, search]);

  const resetForm = () => {
    setForm({
      bloodGroup: "A+",
      quantity: "",
      collectionDate: "",
      expiryDate: "",
      donorName: "",
      donorPhone: "",
      donorEmail: ""
    });
    setSelectedDonor(null);
    setSearch("");
    setError("");
  };

  const handleSelectDonor = (donor) => {
    setSelectedDonor(donor);
    setForm((prev) => ({
      ...prev,
      donorName: donor?.name || "",
      donorPhone: donor?.phone || "",
      donorEmail: donor?.email || "",
      bloodGroup: donor?.bloodGroup || prev.bloodGroup
    }));
  };

  // ── Auto-calculate expiry when collection date changes ──
  const handleCollectionDateChange = (e) => {
    const date = e.target.value;
    setForm((prev) => ({
      ...prev,
      collectionDate: date,
      expiryDate: date ? addDays(date, 42) : ""
    }));
  };

  const handleAdd = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const todayStr = new Date().toISOString().split("T")[0];
      const collectionDate = form.collectionDate || todayStr;
      const expiryDate = form.expiryDate || addDays(collectionDate, 42);

      const payload = {
        ...form,
        collectionDate,
        expiryDate,
        donorId: selectedDonor?._id || null
      };

      await API.post("/inventory", payload);

      setSuccess("Blood unit added successfully.");
      setOpen(false);
      resetForm();
      await fetchInventory();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to add blood unit");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this blood unit?")) {
      await API.delete(`/inventory/${id}`);
      fetchInventory();
    }
  };

  const getStatusColor = (status) =>
    status === "Available" ? "success" : status === "Low Stock" ? "warning" : "error";

  return (
    <Container maxWidth="xl" style={{ marginTop: 24, marginBottom: 24 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <Box>
          <Typography variant="h4" style={{ color: "#c62828", fontWeight: 700 }}>🩸 Blood Inventory</Typography>
          <Typography variant="body2" color="text.secondary">
            Add units by selecting an already registered donor.
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ backgroundColor: "#c62828", px: 3, py: 1.2 }}>
          + Add Blood Unit
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#ffebee" }}>
              <TableCell><b>Blood Group</b></TableCell>
              <TableCell><b>Quantity</b></TableCell>
              <TableCell><b>Collection Date</b></TableCell>
              <TableCell><b>Expiry Date</b></TableCell>
              <TableCell><b>Donor</b></TableCell>
              <TableCell><b>Contact</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item._id} hover>
                <TableCell><b style={{ color: "#c62828" }}>{item.bloodGroup}</b></TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{new Date(item.collectionDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                <TableCell>{item.donorName || item.donorId?.name || "Unknown"}</TableCell>
                <TableCell>{item.donorPhone || item.donorId?.phone || "-"}</TableCell>
                <TableCell>
                  <Chip label={item.status} color={getStatusColor(item.status)} size="small" />
                </TableCell>
                <TableCell>
                  <Button size="small" color="error" onClick={() => handleDelete(item._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => { setOpen(false); resetForm(); }} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 700 }}>Add Blood Unit</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={filteredDonors}
                value={selectedDonor}
                onChange={(e, value) => handleSelectDonor(value)}
                inputValue={search}
                onInputChange={(e, value) => setSearch(value)}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                getOptionLabel={(option) => `${option.name || ""} | ${option.email || ""} | ${option.phone || ""}`}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option._id} sx={{ py: 1 }}>
                    <Stack spacing={0.2}>
                      <Typography fontWeight={700}>{option.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.email || "No email"} • {option.phone || "No phone"} • {option.bloodGroup}
                      </Typography>
                    </Stack>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Search Donor by Name / Email / Phone" placeholder="Type to search registered donors" />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Selected Donor"
                value={selectedDonor ? `${selectedDonor.name} (${selectedDonor.email || selectedDonor.phone || "no contact"})` : "No donor selected"}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Blood Group</InputLabel>
                <Select value={form.bloodGroup} label="Blood Group" onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>
                  {BLOOD_GROUPS.map((bg) => <MenuItem key={bg} value={bg}>{bg}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Collection Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.collectionDate}
                onChange={handleCollectionDateChange}
                helperText="Expiry date will be set to 42 days after this"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.expiryDate}
                InputProps={{ readOnly: true }}
                helperText="Auto-calculated (Collection + 42 days)"
                sx={{ "& .MuiInputBase-root": { backgroundColor: "#f5f5f5" } }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Donor Name" value={form.donorName} onChange={(e) => setForm({ ...form, donorName: e.target.value })} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Donor Phone" value={form.donorPhone} onChange={(e) => setForm({ ...form, donorPhone: e.target.value })} />
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info">
                Select a registered donor to automatically update their last donation date and send certificate by email. Expiry date is automatically set to <b>42 days</b> from the collection date.
              </Alert>
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => { setOpen(false); resetForm(); }} disabled={loading}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={loading} sx={{ backgroundColor: "#c62828" }}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Inventory;

