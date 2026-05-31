
const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  bloodGroup: { type: String, required: true, enum: ["A+","A-","B+","B-","AB+","AB-","O+","O-"] },
  quantity: { type: Number, required: true, default: 0 },
  collectionDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor" },
  donorName: { type: String },
  donorPhone: { type: String },
  donorEmail: { type: String },
  status: { type: String, enum: ["Available","Low Stock","Expired"], default: "Available" },
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);