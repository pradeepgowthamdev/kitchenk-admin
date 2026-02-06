import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import emailRouter from "./routes/emailRoute.js";
import inventoryRouter from "./routes/inventoryRoute.js";
import authRouter from "./routes/authRoute.js";
import whatsappRouter from "./routes/whatsappRoute.js";
import reportRouter from "./routes/reportRoute.js";

dotenv.config();
const app = express();

/**
 * ✅ CORS
 * Allow production frontend + local dev.
 */
app.use(
  cors({
    origin: [
      "https://gogrocer.ca",
      "https://www.gogrocer.ca",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

app.use(express.json({ limit: "2mb" }));

/**
 * ✅ Routes
 */
app.use("/send-email", emailRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/auth", authRouter);
app.use("/api/whatsapp", whatsappRouter);

// ✅ NEW: PDF report routes
app.use("/api/reports", reportRouter);

/**
 * ✅ Health checks
 */
app.get("/", (req, res) => res.send("API working"));
app.get("/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

const PORT = process.env.PORT || 5001;

async function start() {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing in .env");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Server start failed:", err.message);
    process.exit(1);
  }
}

start();