
const User = require("../models/userModel");
const Donor = require("../models/donorModel");
const Hospital = require("../models/hospitalModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, bloodGroup, age, gender, phone, address, hospitalName, licenseNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: role || "donor" });

    if (role === "donor") await Donor.create({ userId: user._id, name, email, bloodGroup, age, gender, phone, address });
    if (role === "hospital") await Hospital.create({ userId: user._id, hospitalName, address, licenseNumber, phone });

    res.status(201).json({ success: true, message: "Registered successfully", token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, message: "Login successful", token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  res.json({ success: true, user: req.user });
};