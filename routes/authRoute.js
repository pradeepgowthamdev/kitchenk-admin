// routes/authRoute.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
    const inputEmail = (email || "").toLowerCase().trim();

    if (!inputEmail || !password) {
      return res.status(400).json({ success: false, message: "Email & password required" });
    }

    if (inputEmail !== adminEmail) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // ✅ Support either plain env password OR hashed env password
    const envPass = process.env.ADMIN_PASSWORD || "";
    const isHashed = envPass.startsWith("$2a$") || envPass.startsWith("$2b$");

    const ok = isHashed
      ? await bcrypt.compare(password, envPass)
      : password === envPass;

    if (!ok) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: adminEmail, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;