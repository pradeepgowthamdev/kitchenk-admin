import express from "express";
import { generateInventoryPdf, downloadAndDeletePdf } from "../controllers/reportController.js";

const router = express.Router();

// POST /api/reports/inventory-pdf
router.post("/inventory-pdf", generateInventoryPdf);

// GET /api/reports/download/:file
router.get("/download/:file", downloadAndDeletePdf);

export default router;