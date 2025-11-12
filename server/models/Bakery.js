// server/models/Bakery.js
import mongoose from "mongoose";

const BakerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  image: String // "bakery1.jpg" or "/images/bakery1.jpg"
}, { timestamps: true });

export default mongoose.model("Bakery", BakerySchema);
