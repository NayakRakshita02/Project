//frontend/src/pages/donor/DonorDashboard.js

import React, { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useAuth } from "../../context/AuthContext";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

const DonorDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const [donorsRes, invRes] = await Promise.all([
          API.get("/donors"),
          API.get("/inventory/summary")
        ]);

        const donorList = Array.isArray(donorsRes.data?.donors) ? donorsRes.data.donors : [];
        const me = donorList.find(d =>
          (user?.email && d.email && d.email === user.email) ||
          (user?.name && d.name && d.name === user.name)
        ) || null;

        setProfile(me);
        setInventory(Array.isArray(invRes.data?.summary) ? invRes.data.summary : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load dashboard");
      }
    };

    if (user) load();
  }, [user]);

  const downloadCertificate = async () => {
    try {
      setSuccess("");
      setError("");
      const res = await API.get(`/donors/${profile._id}/certificate`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `donation-certificate-${profile.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setSuccess("Certificate downloaded successfully.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to download certificate");
    }
  };

  const donationStatus = profile?.lastDonationDate ? "Donated" : "Not donated yet";

  return (
    <Container maxWidth="md" style={{ marginTop: 48, marginBottom: 32 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom style={{ color: "#c62828", fontWeight: 700 }}>
          🩸 Donor Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View your profile, donation status, and blood availability.
        </Typography>
      </Box>

      {error && <Alert severity="error" style={{ marginBottom: 16 }}>{error}</Alert>}
      {success && <Alert severity="success" style={{ marginBottom: 16 }}>{success}</Alert>}

      <Paper style={{ padding: 24, marginBottom: 24 }} elevation={2}>
        <Typography variant="h6" gutterBottom>My Profile</Typography>
        <Divider style={{ marginBottom: 12 }} />

        {profile ? (
          <Grid container spacing={2}>
            {[
              ["Name", profile.name],
              ["Blood Group", profile.bloodGroup],
              ["Age", profile.age || "-"],
              ["Gender", profile.gender || "-"],
              ["Phone", profile.phone || "-"],
              ["Email", profile.email || "-"],
              ["Last Donation", profile.lastDonationDate ? new Date(profile.lastDonationDate).toLocaleDateString() : "Not yet"]
            ].map(([label, value]) => (
              <Grid item xs={12} sm={6} key={label}>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
                <Typography><b>{value}</b></Typography>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, flexWrap: "wrap" }}>
                <Typography variant="body2" color="text.secondary">Donation status:</Typography>
                <Chip
                  label={donationStatus}
                  color={profile.lastDonationDate ? "success" : "warning"}
                  size="small"
                />
                {profile.lastDonationDate && (
                  <Button variant="outlined" size="small" onClick={downloadCertificate} sx={{ ml: 1 }}>
                    Download Certificate
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <Typography color="text.secondary">
            Profile not found. Make sure the donor account is registered properly.
          </Typography>
        )}
      </Paper>

      <Paper style={{ padding: 24 }} elevation={2}>
        <Typography variant="h6" gutterBottom>Current Blood Bank Availability</Typography>
        <Divider style={{ marginBottom: 12 }} />

        <Grid container spacing={2}>
          {inventory.map((item) => (
            <Grid item xs={6} sm={3} key={item._id || item.name}>
              <Paper variant="outlined" style={{ padding: 12, textAlign: "center" }}>
                <Typography variant="h5" style={{ color: "#c62828" }}>
                  <b>{item._id || item.name}</b>
                </Typography>
                <Typography variant="body2">{item.total} units</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default DonorDashboard;