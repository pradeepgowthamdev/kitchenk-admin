import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import emailRouter from "./routes/emailRoute.js";
import inventoryRouter from "./routes/inventoryRoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// POST /send-email
app.use("/send-email", emailRouter);

// GET /api/inventory/list
app.use("/api/inventory", inventoryRouter);

app.get("/", (req, res) => {
  res.send("Email API working");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));