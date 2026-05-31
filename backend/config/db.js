const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`.bgCyan.white);
  } catch (error) {
    console.log(`MongoDB Error: ${error.message}`.bgRed.white);
    process.exit(1);
  }
};

module.exports = connectDB;