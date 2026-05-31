//backend/controllers/hospitalController.js

const Hospital = require("../models/hospitalModel");

exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().populate("userId", "name email");
    res.json({ success: true, hospitals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.approveHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    res.json({ success: true, message: "Hospital approved", hospital });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.rejectHospital = async (req, res) => {
  try {
    await Hospital.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Hospital rejected and removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

