//backend/utils/certificate.js

const PDFDocument = require("pdfkit");

const generateDonationCertificate = ({ name, bloodGroup, donationDate, certificateId, hospitalName }) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 0 });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const W = 595.28;
    const H = 841.89;
    const red = "#b80f0a";
    const deepRed = "#8f0d0a";
    const gold = "#d9a441";
    const dark = "#2b2b2b";

    doc.rect(0, 0, W, H).fill("#ffffff");
    doc.rect(18, 18, W - 36, H - 36).lineWidth(3).stroke(red);
    doc.rect(28, 28, W - 56, H - 56).lineWidth(1.2).stroke("#d9d9d9");
    doc.roundedRect(35, 35, W - 70, H - 70, 14).lineWidth(0.8).stroke("#efefef");

    doc.moveTo(0, 560)
      .bezierCurveTo(120, 500, 190, 650, 300, 590)
      .bezierCurveTo(410, 530, 470, 680, W, 600)
      .lineTo(W, H)
      .lineTo(0, H)
      .closePath()
      .fill(deepRed);

    doc.moveTo(0, 590)
      .bezierCurveTo(120, 520, 185, 690, 310, 620)
      .bezierCurveTo(430, 560, 500, 710, W, 640)
      .lineTo(W, H)
      .lineTo(0, H)
      .closePath()
      .fill("#d71920");

    doc.moveTo(0, 615)
      .bezierCurveTo(120, 560, 190, 730, 320, 655)
      .bezierCurveTo(440, 595, 510, 750, W, 675)
      .lineTo(W, H)
      .lineTo(0, H)
      .closePath()
      .fill("#ff3b3b");

    doc.opacity(0.12);
    for (let i = 0; i < 10; i++) {
      const x = 20 + i * 58;
      const y = 60 + (i % 3) * 25;
      doc.circle(x, y, 16).fill("#b80f0a");
    }
    doc.opacity(1);

    doc.circle(W / 2, 560, 42).fill("#fbe5a0");
    doc.circle(W / 2, 560, 30).fill("#ffcf57");
    doc.circle(W / 2, 560, 20).fill("#fff7cf");
    doc.roundedRect(W / 2 - 6, 598, 12, 42, 2).fill(gold);
    doc.polygon([W / 2 - 18, 640], [W / 2 - 2, 640], [W / 2 - 10, 668]).fill("#d59a41");
    doc.polygon([W / 2 + 2, 640], [W / 2 + 18, 640], [W / 2 + 10, 668]).fill("#b96a3a");

    doc.font("Times-Roman").fontSize(12).fillColor("#8d0000").text(hospitalName || "Blood Bank Management System", 0, 60, { align: "center" });
    doc.font("Helvetica-Bold").fontSize(34).fillColor(red).text("CERTIFICATE", 0, 95, { align: "center", characterSpacing: 1.2 });
    doc.font("Helvetica-Bold").fontSize(14).fillColor(deepRed).text("OF BLOOD DONATION", 0, 135, { align: "center", characterSpacing: 3 });

    doc.font("Helvetica").fontSize(15).fillColor(dark).text("This certificate is presented to", 0, 195, { align: "center" });
    doc.font("Times-Italic").fontSize(36).fillColor(red).text(name || "Donor Name", 0, 230, { align: "center" });
    doc.moveTo(120, 285).lineTo(476, 285).lineWidth(1).stroke("#1f1f1f");

    doc.font("Helvetica").fontSize(13).fillColor(dark).text("in recognition of your generous contribution as a blood donor", 0, 305, { align: "center" });
    doc.font("Helvetica").fontSize(13).fillColor(dark).text(`on ${donationDate ? new Date(donationDate).toLocaleDateString() : "N/A"}.`, 0, 325, { align: "center" });

    doc.font("Helvetica").fontSize(13).fillColor(dark).text("Your selfless act has helped save lives and brought hope to those in need.", 0, 380, { align: "center" });
    doc.font("Helvetica").fontSize(13).fillColor(dark).text("Thank you for being a true hero.", 0, 402, { align: "center" });

    doc.roundedRect(55, 455, 190, 80, 10).fillAndStroke("#fffdfd", red);
    doc.roundedRect(350, 455, 190, 80, 10).fillAndStroke("#fffdfd", red);

    doc.font("Helvetica-Bold").fontSize(12).fillColor(dark).text("Certificate ID", 72, 470);
    doc.font("Helvetica").fontSize(13).fillColor(red).text(certificateId || "N/A", 72, 490);

    doc.font("Helvetica-Bold").fontSize(12).fillColor(dark).text("Blood Group", 372, 470);
    doc.font("Helvetica").fontSize(13).fillColor(red).text(bloodGroup || "N/A", 372, 490);

    const y = 690;
    doc.moveTo(58, y).lineTo(210, y).stroke("#1f1f1f");
    doc.moveTo(385, y).lineTo(537, y).stroke("#1f1f1f");

    doc.font("Helvetica").fontSize(12).fillColor(dark).text("Blood Donor Event", 58, y + 10, { width: 152, align: "center" });
    doc.font("Helvetica").fontSize(12).fillColor(dark).text("Medical Officer", 385, y + 10, { width: 152, align: "center" });
    doc.font("Helvetica-Bold").fontSize(12).fillColor(red).text("Authorized Signature", 58, y + 30, { width: 152, align: "center" });
    doc.font("Helvetica-Bold").fontSize(12).fillColor(red).text("Approved By", 385, y + 30, { width: 152, align: "center" });

    doc.end();
  });
};

module.exports = { generateDonationCertificate };
