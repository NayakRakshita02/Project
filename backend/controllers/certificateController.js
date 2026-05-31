//backend/controllers/certificateController.js

const Donor = require("../models/donorModel");
const { generateDonationCertificate } = require("../utils/certificate");

exports.downloadCertificate = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.donorId);
    if (!donor) return res.status(404).json({ success: false, message: "Donor not found" });

    const buffer = await generateDonationCertificate({
      name: donor.name,
      bloodGroup: donor.bloodGroup,
      donationDate: donor.lastDonationDate || new Date(),
      certificateId: `CERT-${donor._id.toString().slice(-8).toUpperCase()}`,
      hospitalName: "Blood Bank Management System"
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=certificate-${donor.name.replace(/\s+/g, "-")}.pdf`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
