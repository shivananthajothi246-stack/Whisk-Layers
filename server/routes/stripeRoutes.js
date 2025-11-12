import express from "express";
import { auth as protect } from "../middleware/authMiddleware.js";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_51QKexample", {
  apiVersion: "2024-12-18.acacia",
});

// Create payment intent
router.post("/create-payment-intent", protect, async (req, res) => {
  try {
    const { amount, currency = "inr" } = req.body;
    const amountInPaise = Math.round(amount * 100); // Convert to smallest currency unit

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: currency,
      metadata: {
        userId: req.user._id.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ message: "Failed to create payment intent", error: err.message });
  }
});

// Confirm payment
router.post("/confirm-payment", protect, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      res.json({
        success: true,
        paymentIntent: paymentIntent,
      });
    } else {
      res.status(400).json({
        success: false,
        message: `Payment status: ${paymentIntent.status}`,
      });
    }
  } catch (err) {
    console.error("Stripe confirmation error:", err);
    res.status(500).json({ message: "Failed to confirm payment", error: err.message });
  }
});

export default router;

