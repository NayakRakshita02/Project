
const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  email: { type: String },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  bloodGroup: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  lastDonationDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Donor", donorSchema);