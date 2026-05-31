
const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  hospitalId:  { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
  bloodGroup:  { type: String, required: true },
  quantity:    { type: Number, required: true },
  emergency:   { type: Boolean, default: false },
  reason:      { type: String },
  status:      { type: String, enum: ["Pending","Approved","Rejected","Dispatched","Completed"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);