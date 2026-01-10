// controllers/inventoryController.js
import Inventory from "../models/Inventory.js";

/**
 * GET /api/inventory/list
 * Used by EmailForm + Admin table
 */
export const listInventory = async (req, res) => {
  try {
    const items = await Inventory.find({ isActive: true })
      .sort({ category: 1, name: 1 });

    return res.json({ success: true, items });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: err.message });
  }
};

/**
 * POST /api/inventory
 * Admin → Create item
 */
export const createInventoryItem = async (req, res) => {
  try {
    const { category, name, brandOptions, unit, regPrice, sizeText } = req.body;

    if (!category || !name) {
      return res.json({ success: false, message: "Category and Name are required" });
    }

    const item = await Inventory.create({
      category: category.trim(),
      name: name.trim(),
      brandOptions: brandOptions || [],
      unit: unit || "",
      regPrice: regPrice || 0,
      sizeText: sizeText || "",
    });

    return res.json({ success: true, item });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({
        success: false,
        message: "Item already exists in this category",
      });
    }

    console.error(err);
    return res.json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/inventory/:id
 * Admin → Update item
 */
export const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.json({ success: false, message: "Item not found" });
    }

    return res.json({ success: true, item });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/inventory/:id
 * Admin → Soft delete (recommended)
 */
export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!item) {
      return res.json({ success: false, message: "Item not found" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: err.message });
  }
};