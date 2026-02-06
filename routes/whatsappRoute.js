import express from "express";
import { sendWhatsAppText } from "../controllers/whatsappController.js";

const router = express.Router();

/**
 * POST /api/whatsapp/send-text
 */
router.post("/send-text", sendWhatsAppText);

export default router;