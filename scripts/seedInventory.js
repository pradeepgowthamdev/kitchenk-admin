import dotenv from "dotenv";
import mongoose from "mongoose";
import Inventory from "../models/Inventory.js";
import { INVENTORY_DATA } from "../data/inventoryData.js";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongo connected");

    // optional: clear old data
    await Inventory.deleteMany({});
    console.log("🧹 Old inventory cleared");

    // insert
    await Inventory.insertMany(
      INVENTORY_DATA.map((x) => ({
        category: x.category,
        name: x.name,
        brandOptions: x.brandOptions || [],
        unit: x.unit || "",
        regPrice: x.regPrice || 0,
        sizeText: x.sizeText || "",
        isActive: true,
      }))
    );

    console.log("✅ Seed completed");
    process.exit(0);
  } catch (e) {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  }
}

seed();