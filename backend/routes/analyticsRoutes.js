//backend/routes/analyticsRoutes.js

const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/analyticsController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

router.get("/dashboard", authMiddleware, adminOnly, getDashboardStats);

module.exports = router;
