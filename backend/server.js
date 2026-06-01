

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));
app.use("/api/v1/donors", require("./routes/donorRoutes"));
app.use("/api/v1/hospitals", require("./routes/hospitalRoutes"));
app.use("/api/v1/requests", require("./routes/requestRoutes"));
app.use("/api/v1/analytics", require("./routes/analyticsRoutes"));
app.use("/api/v1/certificates", require("./routes/certificateRoutes"));
app.use("/api/v1/donations", require("./routes/donationRoutes"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgGreen.white);
});