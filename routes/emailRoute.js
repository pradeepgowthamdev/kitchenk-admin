import express from "express";
import { sendEmail } from "../controllers/emailController.js";

const router = express.Router();

// POST /send-email
router.post("/", sendEmail);

export default router;