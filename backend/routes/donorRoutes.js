//backend/routes/donorRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAllDonors,
  getDonorById,
  addDonor,
  updateDonor,
  deleteDonor,
  downloadCertificate
} = require("../controllers/donorController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getAllDonors);
router.get("/:id", authMiddleware, getDonorById);
router.get("/:id/certificate", authMiddleware, downloadCertificate);
router.post("/", authMiddleware, adminOnly, addDonor);
router.put("/:id", authMiddleware, adminOnly, updateDonor);
router.delete("/:id", authMiddleware, adminOnly, deleteDonor);

module.exports = router;