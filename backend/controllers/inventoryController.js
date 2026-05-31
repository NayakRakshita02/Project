
const Inventory = require("../models/inventoryModel");
const Donor = require("../models/donorModel");
const { sendMail } = require("../utils/mailer");
const { generateDonationCertificate } = require("../utils/certificate");

const computeStatus = (quantity, expiryDate) => {
  const expiry = expiryDate ? new Date(expiryDate) : null;
  if (expiry && !Number.isNaN(expiry.getTime()) && expiry < new Date()) return "Expired";
  if (Number(quantity) <= 5) return "Low Stock";
  return "Available";
};

const normalizeDate = (value, fallback) => {
  const d = value ? new Date(value) : fallback;
  return Number.isNaN(d.getTime()) ? fallback : d;
};

exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("donorId", "name bloodGroup phone email");
    res.json({
      success: true,
      inventory: inventory.map(item => ({
        ...item.toObject(),
        donorName: item.donorName || item.donorId?.name || "Unknown",
        donorPhone: item.donorPhone || item.donorId?.phone || "-",
        donorEmail: item.donorEmail || item.donorId?.email || "-",
        status: computeStatus(item.quantity, item.expiryDate)
      }))
    });
  } catch (err) {
    console.error("getAllInventory error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getInventorySummary = async (req, res) => {
  try {
    const summary = await Inventory.aggregate([
      { $group: { _id: "$bloodGroup", total: { $sum: "$quantity" } } }
    ]);
    res.json({ success: true, summary });
  } catch (err) {
    console.error("getInventorySummary error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addBloodUnit = async (req, res) => {
  try {
    const { bloodGroup, quantity, collectionDate, expiryDate, donorId, donorName, donorPhone, donorEmail } = req.body;
    console.log("addBloodUnit payload:", req.body);

    let donor = donorId ? await Donor.findById(donorId) : null;
    if (!donor && (donorEmail || donorPhone || donorName)) {
      const or = [];
      if (donorEmail) or.push({ email: donorEmail });
      if (donorPhone) or.push({ phone: donorPhone });
      if (donorName) or.push({ name: donorName });
      donor = await Donor.findOne({ $or: or });
    }

    const collection = normalizeDate(collectionDate, new Date());
    const expiry = normalizeDate(expiryDate, new Date(Date.now() + 42 * 24 * 60 * 60 * 1000));
    const qty = Number(quantity) || 0;

    const unit = await Inventory.create({
      bloodGroup,
      quantity: qty,
      collectionDate: collection,
      expiryDate: expiry,
      donorId: donor?._id || donorId || null,
      donorName: donor?.name || donorName || "Unknown",
      donorPhone: donor?.phone || donorPhone || "-",
      donorEmail: donor?.email || donorEmail || "-",
      status: computeStatus(qty, expiry)
    });

    let certificateId = null;
    let emailSent = false;

    if (donor) {
      donor.lastDonationDate = collection;
      await donor.save();

      certificateId = `CERT-${donor._id.toString().slice(-8).toUpperCase()}`;

      const pdfBuffer = await generateDonationCertificate({
        name: donor.name,
        bloodGroup: donor.bloodGroup,
        donationDate: donor.lastDonationDate,
        certificateId,
        hospitalName: "Blood Bank Management System"
      });

      if (donor.email) {
        try {
          await sendMail({
            to: donor.email,
            subject: "Your blood donation certificate",
            text: `Dear ${donor.name}, thank you for donating blood. Your certificate is attached.`,
            html: `<p>Dear <b>${donor.name}</b>,</p><p>Thank you for donating blood.</p><p>Certificate ID: <b>${certificateId}</b></p>`,
            attachments: [
              {
                filename: `certificate-${donor.name}.pdf`,
                content: pdfBuffer,
                contentType: "application/pdf"
              }
            ]
          });
          emailSent = true;
        } catch (mailErr) {
          console.error("certificate email failed:", mailErr.message);
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: "Blood unit added successfully",
      unit,
      certificateId,
      emailSent
    });
  } catch (err) {
    console.error("addBloodUnit error:", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to add blood unit" });
  }
};

exports.updateBloodUnit = async (req, res) => {
  try {
    const existing = await Inventory.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Inventory item not found" });

    const update = { ...req.body };
    update.status = computeStatus(update.quantity ?? existing.quantity, update.expiryDate || existing.expiryDate);

    const unit = await Inventory.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, message: "Updated", unit });
  } catch (err) {
    console.error("updateBloodUnit error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteBloodUnit = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("deleteBloodUnit error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};