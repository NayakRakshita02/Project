//frontend/src/components/Navbar.js

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <AppBar position="static" style={{ backgroundColor: "#c62828" }}>
      <Toolbar>
        <BloodtypeIcon style={{ marginRight: 8 }} />
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Blood Bank Management System
        </Typography>
        {user && (
          <>
            <Button color="inherit" component={Link} to={`/${user.role}`}>Dashboard</Button>
            <Button color="inherit" onClick={handleLogout}>Logout ({user.name})</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;