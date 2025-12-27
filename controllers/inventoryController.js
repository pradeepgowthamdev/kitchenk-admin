// controllers/inventoryController.js
import { INVENTORY_DATA } from "../data/inventoryData.js";

// GET /api/inventory/list
export const listInventory = async (req, res) => {
  try {
    return res.json({ success: true, items: INVENTORY_DATA });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: err.message });
  }
};