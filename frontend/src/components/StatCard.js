//frontend/src/components/StatCard.js


import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const StatCard = ({ title, value, color = "#c62828", icon }) => (
  <Card style={{ borderLeft: `5px solid ${color}`, minWidth: 180 }}>
    <CardContent>
      <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
      <Typography variant="h4" style={{ color }}>{value}</Typography>
    </CardContent>
  </Card>
);

export default StatCard;