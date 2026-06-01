import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

const STATS = [
  { value: "10,000+", label: "Lives Saved" },
  { value: "5,000+", label: "Registered Donors" },
  { value: "8+", label: "Blood Groups Managed" },
  { value: "24/7", label: "Support Available" },
];

const FEATURES = [
  { icon: "🩸", title: "Easy Registration", desc: "Register as a blood donor in minutes. Your details are stored securely for future donation tracking." },
  { icon: "🔍", title: "Find Blood Fast", desc: "Search available blood units by group in real time. No delays when it matters most." },
  { icon: "📋", title: "Donation History", desc: "Track all your past donations and receive a certificate for every contribution." },
  { icon: "🏥", title: "Hospital Ready", desc: "Admin panel for hospitals to manage inventory, donors, and blood requests efficiently." },
  { icon: "📧", title: "Auto Certificate", desc: "Get your blood donation certificate automatically emailed after every donation." },
  { icon: "📊", title: "Live Dashboard", desc: "Real-time blood availability dashboard for admins and donors at a glance." },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Register", desc: "Create your donor account on our platform." },
  { step: "02", title: "Donate", desc: "Visit the blood bank. Admin logs your donation." },
  { step: "03", title: "Track", desc: "View your donation history and download your certificate." },
  { step: "04", title: "Save Lives", desc: "Your blood helps patients in critical need." },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ fontFamily: "Helvetica, sans-serif" }}>

      {/* ─── HERO ─── */}
      <Box sx={{
        background: "linear-gradient(135deg, #b71c1c 0%, #7f0000 60%, #4a0000 100%)",
        color: "#fff", py: { xs: 10, md: 16 }, px: 3,
        position: "relative", overflow: "hidden",
      }}>
        <Box sx={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -100, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <Typography variant="h2" fontWeight={800} gutterBottom sx={{ fontSize: { xs: "2rem", md: "3.2rem" }, letterSpacing: 1 }}>
            🩸 Blood Bank Management System
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.88, mb: 5, maxWidth: 620, mx: "auto", lineHeight: 1.8 }}>
            Connecting donors, saving lives. Register, donate, and track your blood donation journey — all in one place.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button variant="contained" size="large" onClick={() => navigate("/register")}
              sx={{ backgroundColor: "#fff", color: "#b71c1c", fontWeight: 700, px: 4, py: 1.6, fontSize: "1rem", borderRadius: 3, "&:hover": { backgroundColor: "#ffebee" } }}>
              Register as Donor
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate("/login")}
              sx={{ borderColor: "#fff", color: "#fff", fontWeight: 700, px: 4, py: 1.6, fontSize: "1rem", borderRadius: 3, "&:hover": { borderColor: "#ffcdd2", backgroundColor: "rgba(255,255,255,0.08)" } }}>
              Login
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ─── STATS ─── */}
      <Box sx={{ backgroundColor: "#b71c1c", py: 5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {STATS.map((s) => (
              <Grid item xs={6} sm={3} key={s.label}>
                <Box sx={{ textAlign: "center", color: "#fff" }}>
                  <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" } }}>{s.value}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85, fontWeight: 500 }}>{s.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── FEATURES ─── */}
      <Box sx={{ backgroundColor: "#fff", py: 10, px: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" color="#b71c1c" gutterBottom>Why Choose Us?</Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 520, mx: "auto" }}>
            Our platform makes blood donation simple, transparent, and impactful.
          </Typography>
          <Grid container spacing={3}>
            {FEATURES.map((f) => (
              <Grid item xs={12} sm={6} md={4} key={f.title}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: "100%", transition: "all 0.25s ease", "&:hover": { boxShadow: "0 8px 30px rgba(183,28,28,0.15)", transform: "translateY(-4px)" } }}>
                  <Typography variant="h3" sx={{ mb: 1.5, fontSize: "2.2rem" }}>{f.icon}</Typography>
                  <Typography variant="h6" fontWeight={700} color="#b71c1c" gutterBottom>{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.8}>{f.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── HOW IT WORKS ─── */}
      <Box sx={{ backgroundColor: "#fff9f9", py: 10, px: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" color="#b71c1c" gutterBottom>How It Works</Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 480, mx: "auto" }}>
            A simple 4-step process to save lives.
          </Typography>
          <Grid container spacing={3}>
            {HOW_IT_WORKS.map((h) => (
              <Grid item xs={12} sm={6} md={3} key={h.step}>
                <Box sx={{ textAlign: "center", px: 2 }}>
                  <Box sx={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#b71c1c", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2, fontSize: "1.3rem", fontWeight: 800 }}>
                    {h.step}
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>{h.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{h.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── CTA ─── */}
      <Box sx={{ background: "linear-gradient(135deg, #b71c1c 0%, #7f0000 100%)", py: 10, px: 3, textAlign: "center", color: "#fff" }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={800} gutterBottom>Ready to Save a Life?</Typography>
          <Typography variant="body1" sx={{ opacity: 0.88, mb: 5, maxWidth: 500, mx: "auto", lineHeight: 1.8 }}>
            Join thousands of donors who are making a difference. Register today and start your donation journey.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button variant="contained" size="large" onClick={() => navigate("/register")}
              sx={{ backgroundColor: "#fff", color: "#b71c1c", fontWeight: 700, px: 5, py: 1.6, fontSize: "1rem", borderRadius: 3, "&:hover": { backgroundColor: "#ffebee" } }}>
              Register Now
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate("/login")}
              sx={{ borderColor: "#fff", color: "#fff", fontWeight: 700, px: 5, py: 1.6, fontSize: "1rem", borderRadius: 3, "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}>
              Login
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ─── FOOTER ─── */}
      <Box sx={{ backgroundColor: "#1a1a1a", color: "#aaa", py: 4, textAlign: "center" }}>
        <Container>
          <Typography variant="body2" gutterBottom>
            🩸 Blood Bank Management System — Saving lives, one donation at a time.
          </Typography>
          <Divider sx={{ borderColor: "#333", my: 1.5 }} />
          <Typography variant="caption" color="#666">
            © {new Date().getFullYear()} Blood Bank Management System. All rights reserved.
          </Typography>
        </Container>
      </Box>

    </Box>
  );
};

export default Home;