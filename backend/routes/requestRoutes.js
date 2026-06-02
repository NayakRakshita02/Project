//backend/routes/requestRoutes.js

const express = require("express");
const router = express.Router();
const {
  createRequest, getAllRequests, getMyRequests,
  updateRequestStatus, makePayment, getAllPayments
} = require("../controllers/requestController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createRequest);
router.get("/", authMiddleware, adminOnly, getAllRequests);
router.get("/mine", authMiddleware, getMyRequests);
router.get("/payments", authMiddleware, adminOnly, getAllPayments);
router.put("/:id/status", authMiddleware, adminOnly, updateRequestStatus);
router.post("/:id/pay", authMiddleware, makePayment);

module.exports = router;