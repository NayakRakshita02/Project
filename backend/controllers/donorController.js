
const Donor = require("../models/donorModel");
const Inventory = require("../models/inventoryModel");
const { generateDonationCertificate } = require("../utils/certificate");

exports.getAllDonors = async (req, res) => {
  try {
    const { bloodGroup, search } = req.query;
    let query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (search) query.name = { $regex: search, $options: "i" };
    const donors = await Donor.find(query);
    res.json({ success: true, donors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ success: false, message: "Donor not found" });
    res.json({ success: true, donor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addDonor = async (req, res) => {
  try {
    const donor = await Donor.create(req.body);
    res.status(201).json({ success: true, donor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, donor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteDonor = async (req, res) => {
  try {
    await Donor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Donor removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.downloadCertificate = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ success: false, message: "Donor not found" });

    if (!donor.lastDonationDate) {
      return res.status(400).json({ success: false, message: "No donation found for this donor" });
    }

    const lastUnit = await Inventory.findOne({ donorId: donor._id }).sort({ collectionDate: -1 });
    const bloodGroup = lastUnit?.bloodGroup || donor.bloodGroup;
    const certificateId = `CERT-${donor._id.toString().slice(-8).toUpperCase()}`;

    const pdfBuffer = await generateDonationCertificate({
      name: donor.name,
      bloodGroup,
      donationDate: donor.lastDonationDate,
      certificateId,
      hospitalName: "Blood Bank Management System"
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=donation-certificate-${donor.name}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error("downloadCertificate error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};