import express from "express";
import { sendEmail, sendInventoryAttachmentEmail } from "../controllers/emailController.js";

const router = express.Router();

// POST /send-email
router.post("/", sendEmail);

// POST /send-email/inventory-attachment
router.post("/inventory-attachment", sendInventoryAttachmentEmail);

export default router;