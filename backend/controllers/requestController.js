
const Request = require("../models/requestModel");
const Inventory = require("../models/inventoryModel");
const Hospital = require("../models/hospitalModel");

exports.createRequest = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user._id });
    if (!hospital) return res.status(404).json({ success: false, message: "Hospital not found" });
    const request = await Request.create({ ...req.body, hospitalId: hospital._id });
    res.status(201).json({ success: true, message: "Request created", request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate("hospitalId", "hospitalName address");
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user._id });
    const requests = await Request.find({ hospitalId: hospital?._id });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log("updateRequestStatus:", req.params.id, "->", status);

    const VALID_STATUSES = ["Pending", "Approved", "Rejected", "Dispatched", "Completed"];
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` });
    }

    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (status === "Approved") {
      // Sum total available stock across all matching units
      const units = await Inventory.find({
        bloodGroup: request.bloodGroup,
        status: { $ne: "Expired" },
        quantity: { $gt: 0 }
      }).sort({ expiryDate: 1 }); // FIFO — oldest first

      const totalAvailable = units.reduce((sum, u) => sum + u.quantity, 0);

      if (totalAvailable < request.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Requested: ${request.quantity}, Available: ${totalAvailable} units of ${request.bloodGroup}`
        });
      }

      // Deduct across units in FIFO order
      let remaining = request.quantity;
      for (const unit of units) {
        if (remaining <= 0) break;
        const deduct = Math.min(unit.quantity, remaining);
        unit.quantity -= deduct;
        if (unit.quantity === 0) unit.status = "Low Stock";
        await unit.save();
        remaining -= deduct;
      }
    }

    request.status = status;
    await request.save();
    res.json({ success: true, message: `Request ${status.toLowerCase()} successfully`, request });
  } catch (err) {
    console.error("updateRequestStatus error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};