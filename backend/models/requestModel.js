
const mongoose = require("mongoose");

const UNIT_PRICE = { "Whole Blood": 1500, Plasma: 1200, Platelets: 1800 };

const requestSchema = new mongoose.Schema({
  hospitalId:    { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
  bloodGroup:    { type: String, required: true },
  quantity:      { type: Number, required: true },
  component:     { type: String, default: "Whole Blood" },
  amount:        { type: Number, default: 0 },
  reason:        { type: String },
  emergency:     { type: Boolean, default: false },
  requestStatus: { type: String, enum: ["Pending","Approved","Rejected","Payment Pending","Paid","Dispatched","Completed"], default: "Pending" },
  paymentStatus: { type: String, enum: ["Pending","Paid","Failed","Refunded"], default: "Pending" },
  paymentId:     { type: mongoose.Schema.Types.ObjectId, ref: "Payment", default: null }
}, { timestamps: true });

requestSchema.pre("save", function(next) {
  const price = UNIT_PRICE[this.component] || 1500;
  this.amount = this.quantity * price;
  next();
});

module.exports = mongoose.model("Request", requestSchema);