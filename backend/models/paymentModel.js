const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  requestId:     { type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true },
  hospitalId:    { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
  amount:        { type: Number, required: true },
  paymentStatus: { type: String, enum: ["Pending","Paid","Failed","Refunded"], default: "Pending" },
  paymentMethod: { type: String, enum: ["Credit Card","Debit Card","UPI","Net Banking"], default: "UPI" },
  transactionId: { type: String, default: null },
  paidAt:        { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);