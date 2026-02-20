import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

const TMP_DIR = process.env.REPORT_TMP_DIR || "/tmp";
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || "").replace(/\/+$/, "");

// Helper: safe filename
function safeName(name) {
  return String(name || "")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .slice(0, 120);
}

// ✅ POST /api/reports/inventory-pdf
export async function generateInventoryPdf(req, res) {
  try {
    const { items = [], note = "" } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Select at least one item" });
    }

    // ensure tmp dir
    fs.mkdirSync(TMP_DIR, { recursive: true });

    const file = `inventory-${Date.now()}-${Math.random().toString(16).slice(2)}.pdf`;
    const filePath = path.join(TMP_DIR, file);

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(18).text("KitchenK Store-room Inventory", { align: "center" });
    doc.moveDown();

    if (note) {
      doc.fontSize(12).text(`Note: ${note}`);
      doc.moveDown();
    }

    const sorted = [...items].sort((a, b) =>
      a.category === b.category
        ? String(a.name || "").localeCompare(String(b.name || ""))
        : String(a.category || "").localeCompare(String(b.category || ""))
    );

    let i = 1;
    let lastCat = null;

    for (const it of sorted) {
      if (it.category !== lastCat) {
        lastCat = it.category;
        doc.moveDown(0.5);
        doc.fontSize(13).text(String(lastCat || "").toUpperCase(), { underline: true });
        doc.moveDown(0.2);
        doc.fontSize(12);
      }

      const brand = it.selectedBrand || "";
      const qty = `${it.qtyNumber || ""} ${it.unit || ""}`.trim();
      doc.text(`${i}. ${it.name || ""}${brand ? " | " + brand : ""}${qty ? " | " + qty : ""}`);
      i++;
    }

    doc.end();

    stream.on("finish", () => {
      // This is what your frontend expects
      const downloadUrl = `/api/reports/download/${encodeURIComponent(file)}`;

      // If you want absolute URL, keep PUBLIC_BASE_URL in .env
      const absolute = PUBLIC_BASE_URL ? `${PUBLIC_BASE_URL}${downloadUrl}` : null;

      res.json({
        success: true,
        downloadUrl,          // relative
        absoluteDownloadUrl: absolute, // optional
      });
    });

    stream.on("error", (err) => {
      console.error("PDF write error:", err);
      res.status(500).json({ success: false, message: "PDF generation failed" });
    });
  } catch (err) {
    console.error("generateInventoryPdf error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// ✅ GET /api/reports/download/:file  (one-time download)
export async function downloadAndDeletePdf(req, res) {
  try {
    const file = safeName(req.params.file);
    if (!file) return res.status(400).send("Invalid file");

    const filePath = path.join(TMP_DIR, file);
    if (!fs.existsSync(filePath)) return res.status(404).send("Not found");

    res.download(filePath, "kitchenk-inventory.pdf", (err) => {
      // delete after download (even if error, attempt cleanup)
      try { fs.unlinkSync(filePath); } catch {}
      if (err) console.error("download error:", err);
    });
  } catch (err) {
    console.error("downloadAndDeletePdf error:", err);
    res.status(500).send("Server error");
  }
}