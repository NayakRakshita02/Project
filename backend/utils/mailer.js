
// backend/utils/mailer.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection on startup
transporter.verify((error) => {
  if (error) {
    console.error("VERIFY ERROR:", error);
  } else {
    console.log("SMTP READY");
  }
});

const sendMail = async ({
  to,
  subject,
  text,
  html,
  attachments = [],
}) => {
  try {
    console.log("=================================");
    console.log("Sending Email...");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Attachments:", attachments.length);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
      attachments,
    });

    console.log("EMAIL SENT SUCCESSFULLY");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Response:", info.response);
    console.log("=================================");

    return info;
  } catch (error) {
    console.error("=================================");
    console.error("EMAIL SEND FAILED");
    console.error(error);
    console.error("=================================");

    throw error;
  }
};

module.exports = { sendMail };