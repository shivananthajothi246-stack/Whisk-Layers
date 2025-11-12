// server/models/Cart.js
import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
  customization: { type: String, default: "" },
  price: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model("Cart", CartSchema);
