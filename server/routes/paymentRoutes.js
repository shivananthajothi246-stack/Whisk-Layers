// server/routes/paymentRoutes.js
import express from "express";
import { createRazorpayOrder, verifyPaymentAndCreateOrder } from "../controllers/paymentController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/create-order", auth, createRazorpayOrder);
router.post("/verify", auth, verifyPaymentAndCreateOrder);

export default router;
