// server/controllers/paymentController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// create an order on Razorpay (returns order id etc)
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    // amount must be in paise
    const options = { amount: Math.round(amount * 100), currency, receipt: receipt || `rcpt_${Date.now()}` };
    const order = await razor.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating payment order" });
  }
};

// verify signature after payment and record order in DB
export const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderPayload } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ msg: "Invalid signature" });
    }

    // signature valid - create order in DB
    const created = await Order.create({
      userId: req.user.id,
      items: orderPayload.items,
      total: orderPayload.total,
      address: orderPayload.address || "",
      paymentId: razorpay_payment_id,
      paymentMethod: "razorpay",
      status: "Paid"
    });

    // clear cart too
    await import("../models/Cart.js").then(m => m.default.findOneAndDelete({ userId: req.user.id }));

    res.json({ success: true, order: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error verifying payment" });
  }
};
