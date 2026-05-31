//backend/routes/inventoryRoutes.js

const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, inventoryController.getAllInventory);
router.get("/summary", authMiddleware, inventoryController.getInventorySummary);
router.post("/", authMiddleware, adminOnly, inventoryController.addBloodUnit);
router.put("/:id", authMiddleware, adminOnly, inventoryController.updateBloodUnit);
router.delete("/:id", authMiddleware, adminOnly, inventoryController.deleteBloodUnit);

module.exports = router;