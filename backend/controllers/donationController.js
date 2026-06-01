const Donor = require("../models/donorModel");
const { sendMail } = require("../utils/mailer");
const { generateDonationCertificate } = require("../utils/certificate");
const Inventory = require("../models/inventoryModel");

exports.recordDonation = async (req, res) => {
  try {
    const {
      donorId,
      donationDate,
      quantity = 1,
      bloodGroup,
      expiryDate,
    } = req.body;
    const donor = await Donor.findById(donorId);
    if (!donor)
      return res
        .status(404)
        .json({ success: false, message: "Donor not found" });

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
      hospitalName: "Blood Bank Management System",
    });

    if (donor.email) {
      try {
        await sendMail({
          to: donorEmail,
          subject: "Blood Donation Certificate",
          html: htmlContent,
          attachments: [
            {
              filename: "certificate.pdf",
              path: pdfPath,
            },
          ],
        });

        console.log("Certificate email sent");
      } catch (error) {
        console.error("Certificate email failed:", error.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Donation recorded, inventory updated, and email sent",
      donor,
      unit,
      certificateId,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
