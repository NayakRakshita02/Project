//backend/routes/hospitalRoutes.js

const express = require("express");
const router = express.Router();
const { getAllHospitals, approveHospital, rejectHospital } = require("../controllers/hospitalController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, adminOnly, getAllHospitals);
router.put("/approve/:id", authMiddleware, adminOnly, approveHospital);
router.delete("/reject/:id", authMiddleware, adminOnly, rejectHospital);

module.exports = router;