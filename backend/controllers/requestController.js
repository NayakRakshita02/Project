
const Request = require("../models/requestModel");
const Payment = require("../models/paymentModel");
const Inventory = require("../models/inventoryModel");
const Hospital = require("../models/hospitalModel");

exports.createRequest = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user._id });
    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }

    const component = req.body.component || "Whole Blood";
    const quantity = Number(req.body.quantity || 0);

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Quantity must be greater than 0" });
    }

    const UNIT_PRICE = { "Whole Blood": 1500, Plasma: 1200, Platelets: 1800 };
    const amount = quantity * (UNIT_PRICE[component] || 1500);

    const request = await Request.create({
      ...req.body,
      component,
      quantity,
      amount,
      hospitalId: hospital._id,
      requestStatus: "Pending",
      paymentStatus: "Pending"
    });

    res.status(201).json({ success: true, message: "Request created", request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("hospitalId", "hospitalName address")
      .populate("paymentId")
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user._id });
    const requests = await Request.find({ hospitalId: hospital?._id })
      .populate("paymentId")
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const VALID = ["Pending","Approved","Rejected","Payment Pending","Paid","Dispatched","Completed"];
    if (!status || !VALID.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${VALID.join(", ")}` });
    }

    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (status === "Approved") {
      const units = await Inventory.find({
        bloodGroup: request.bloodGroup,
        status: { $ne: "Expired" },
        quantity: { $gt: 0 }
      }).sort({ expiryDate: 1 });

      const totalAvailable = units.reduce((s, u) => s + u.quantity, 0);
      if (totalAvailable < request.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Requested: ${request.quantity}, Available: ${totalAvailable} units of ${request.bloodGroup}`
        });
      }

      let remaining = request.quantity;
      for (const unit of units) {
        if (remaining <= 0) break;
        const deduct = Math.min(unit.quantity, remaining);
        unit.quantity -= deduct;
        if (unit.quantity <= 5) unit.status = "Low Stock";
        await unit.save();
        remaining -= deduct;
      }

      request.requestStatus = "Approved";
      request.paymentStatus = "Pending";
      await request.save();

      const payment = await Payment.create({
        requestId: request._id,
        hospitalId: request.hospitalId,
        amount: request.amount,
        paymentStatus: "Pending"
      });
      request.paymentId = payment._id;
      await request.save();

      return res.json({ success: true, message: "Request approved. Payment pending.", request });
    }

    if (status === "Dispatched") {
      if (request.paymentStatus !== "Paid") {
        return res.status(400).json({ success: false, message: "Cannot dispatch. Payment not completed yet." });
      }
    }

    request.requestStatus = status;
    await request.save();
    res.json({ success: true, message: `Status updated to ${status}`, request });
  } catch (err) {
    console.error("updateRequestStatus error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.makePayment = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const request = await Request.findById(req.params.id).populate("paymentId");
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });
    if (request.paymentStatus === "Paid") return res.status(400).json({ success: false, message: "Already paid" });
    if (request.requestStatus !== "Approved") return res.status(400).json({ success: false, message: "Request not approved yet" });

    const transactionId = "TXN" + Date.now().toString().slice(-8).toUpperCase();
    await Payment.findByIdAndUpdate(request.paymentId, {
      paymentStatus: "Paid",
      paymentMethod: paymentMethod || "UPI",
      transactionId,
      paidAt: new Date()
    });

    request.paymentStatus = "Paid";
    request.requestStatus = "Paid";
    await request.save();

    res.json({ success: true, message: "Payment successful", transactionId });
  } catch (err) {
    console.error("makePayment error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({ path: "requestId", populate: { path: "hospitalId", select: "hospitalName" } })
      .populate("hospitalId", "hospitalName")
      .sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};