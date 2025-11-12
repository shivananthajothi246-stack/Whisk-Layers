// server/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String, // "cake1.jpg" or "/images/cake1.jpg"
  bakery: { type: mongoose.Schema.Types.ObjectId, ref: "Bakery", default: null },
  customizable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);
