// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
console.log('=== BACKEND STARTED (server.js) ===');

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import bakeryRoutes from "./routes/bakeryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// static images (served by backend if requested)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "public/images")));

// API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bakeries", bakeryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// optional seed endpoint to create demo bakeries/products (call once if you want).


// health
app.get("/", (req, res) => res.send("WhiskLayers API"));

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
  })
  .catch(err => {
    console.error("DB connect failed", err);
  });
