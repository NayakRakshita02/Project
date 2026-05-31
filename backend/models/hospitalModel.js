const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hospitalName:  { type: String, required: true },
  address:       { type: String, required: true },
  licenseNumber: { type: String, required: true },
  phone:         { type: String },
  approved:      { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Hospital", hospitalSchema);