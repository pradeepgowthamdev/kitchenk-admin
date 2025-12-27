import express from "express";
import { listInventory } from "../controllers/inventoryController.js";

const inventoryRouter = express.Router();

// GET /api/inventory/list
inventoryRouter.get("/list", listInventory);

export default inventoryRouter;