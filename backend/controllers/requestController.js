//backend/controllers/requestController.js

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
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (status === "Approved") {
      const inv = await Inventory.findOne({ bloodGroup: request.bloodGroup, quantity: { $gte: request.quantity } });
      if (!inv) return res.status(400).json({ success: false, message: "Insufficient blood stock" });
      inv.quantity -= request.quantity;
      await inv.save();
    }
    request.status = status;
    await request.save();
    res.json({ success: true, message: "Status updated", request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};