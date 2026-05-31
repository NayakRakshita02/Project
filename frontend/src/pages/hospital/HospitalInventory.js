//frontend/src/pages/hospital/HospitalInventory.js

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
import Alert from "@mui/material/Alert";

const HospitalInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    API.get("/inventory").then(res => {
      setInventory(res.data.inventory);
      setLowStock(res.data.inventory.filter(i => i.quantity <= 5));
    });
  }, []);

  return (
    <Container maxWidth="lg" style={{ marginTop: 32 }}>
      <Typography variant="h5" gutterBottom style={{ color: "#c62828" }}>📦 Blood Availability</Typography>
      {lowStock.length > 0 && (
        <Alert severity="warning" style={{ marginBottom: 16 }}>
          Low stock alert: {lowStock.map(i => `${i.bloodGroup} (${i.quantity} units)`).join(", ")}
        </Alert>
      )}
      <Paper>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#ffebee" }}>
              <TableCell><b>Blood Group</b></TableCell>
              <TableCell><b>Quantity</b></TableCell>
              <TableCell><b>Expiry Date</b></TableCell>
              <TableCell><b>Status</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map(item => (
              <TableRow key={item._id}>
                <TableCell><b style={{ color: "#c62828" }}>{item.bloodGroup}</b></TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip label={item.status}
                    color={item.status === "Available" ? "success" : item.status === "Low Stock" ? "warning" : "error"}
                    size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default HospitalInventory;
