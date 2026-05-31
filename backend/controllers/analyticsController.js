//backend/controllers/analyticsController.js

const Inventory = require("../models/inventoryModel");
const Donor = require("../models/donorModel");
const Hospital = require("../models/hospitalModel");
const Request = require("../models/requestModel");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalDonors    = await Donor.countDocuments({ isActive: true });
    const totalHospitals = await Hospital.countDocuments({ approved: true });
    const totalUnits     = await Inventory.aggregate([{ $group: { _id: null, total: { $sum: "$quantity" } } }]);
    const pendingReqs    = await Request.countDocuments({ status: "Pending" });
    const emergencyReqs  = await Request.countDocuments({ emergency: true, status: "Pending" });
    const now            = new Date();
    const expiringSoon   = await Inventory.find({ expiryDate: { $lte: new Date(now.getTime() + 3 * 86400000) } });
    const bloodGroupSummary = await Inventory.aggregate([
      { $group: { _id: "$bloodGroup", total: { $sum: "$quantity" } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalDonors,
        totalHospitals,
        totalBloodUnits: totalUnits[0]?.total || 0,
        pendingRequests: pendingReqs,
        emergencyRequests: emergencyReqs,
        expiringSoon: expiringSoon.length,
        bloodGroupSummary,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
