//backend/routes/certificateRoutes.js

const express = require("express");
const router = express.Router();
const { downloadCertificate } = require("../controllers/certificateController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/:donorId", authMiddleware, downloadCertificate);

module.exports = router;