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

// ✅ handle ALL preflight (this avoids the "*" path-to-regexp problem)
app.options(/.*/, cors());

app.use(express.json({ limit: "2mb" }));

app.use("/send-email", emailRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/auth", authRouter);
app.use("/api/whatsapp", whatsappRouter);
app.use("/api/reports", reportRouter);

app.get("/health", (req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

const PORT = process.env.PORT || 5001;

async function start() {
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  });
}
start();