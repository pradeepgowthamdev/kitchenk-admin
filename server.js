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

const allowedOrigins = [
  "https://gogrocer.ca",
  "https://www.gogrocer.ca",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // curl/postman
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

// CORS first
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// JSON (keep only once)
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/inventory", inventoryRouter);
app.use("/api/auth", authRouter);
app.use("/api/whatsapp", whatsappRouter);
app.use("/api/reports", reportRouter);
app.use("/send-email", emailRouter);

// Health
app.get("/", (req, res) => res.send("API working"));
app.get("/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

const PORT = process.env.PORT || 5001;

async function start() {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing in .env");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server start failed:", err.message);
    process.exit(1);
  }
}

start();