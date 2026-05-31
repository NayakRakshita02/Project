
const Donor = require("../models/donorModel");
const { sendMail } = require("../utils/mailer");
const { generateDonationCertificate } = require("../utils/certificate");
const Inventory = require("../models/inventoryModel");

exports.recordDonation = async (req, res) => {
  try {
    const { donorId, donationDate, quantity = 1, bloodGroup, expiryDate } = req.body;
    const donor = await Donor.findById(donorId);
    if (!donor) return res.status(404).json({ success: false, message: "Donor not found" });

    donor.lastDonationDate = donationDate || new Date();
    await donor.save();

    const unit = await Inventory.create({
      bloodGroup: bloodGroup || donor.bloodGroup,
      quantity,
      collectionDate: donationDate || new Date(),
      expiryDate: expiryDate || new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
      donorId: donor._id,
      donorName: donor.name,
      donorPhone: donor.phone,
      donorEmail: donor.email,
    });

    const certificateId = `CERT-${donor._id.toString().slice(-8).toUpperCase()}`;
    const pdfBuffer = await generateDonationCertificate({
      name: donor.name,
      bloodGroup: donor.bloodGroup,
      donationDate: donor.lastDonationDate,
      certificateId,
      hospitalName: "Blood Bank Management System"
    });

    if (donor.email) {
      await sendMail({
        to: donor.email,
        subject: "Thank you for your blood donation",
        text: `Dear ${donor.name}, thank you for donating blood. Your certificate is attached.`,
        html: `<p>Dear <b>${donor.name}</b>,</p><p>Thank you for donating blood.</p><p>Certificate ID: <b>${certificateId}</b></p>`,
        attachments: [{ filename: `certificate-${donor.name}.pdf`, content: pdfBuffer, contentType: "application/pdf" }]
      });
    }

    res.status(200).json({
      success: true,
      message: "Donation recorded, inventory updated, and email sent",
      donor,
      unit,
      certificateId
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};