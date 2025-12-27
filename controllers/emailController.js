import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
  try {
    const { to, cc, subject, message } = req.body;

    if (!to) return res.json({ success: false, message: "Recipient email required." });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      cc: cc?.trim() ? cc.trim() : undefined,
      subject: subject || "KitchenK Inventory",
      html: message || "<p></p>",
    });

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: err.message });
  }
};