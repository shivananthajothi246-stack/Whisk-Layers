// server/routes/productRoutes.js
import express from "express";
import { listProducts, getProduct, productsByBakery } from "../controllers/productController.js";
const router = express.Router();
router.get("/", listProducts);
router.get("/bakery/:bakeryId", productsByBakery);
router.get("/:id", getProduct);
export default router;
