//backend/routes/donationRoutes.js


const express = require("express");
const router = express.Router();
const { recordDonation } = require("../controllers/donationController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

router.post("/record", authMiddleware, adminOnly, recordDonation);

module.exports = router;