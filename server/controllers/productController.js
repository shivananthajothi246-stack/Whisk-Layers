// server/controllers/productController.js
import Product from "../models/Product.js";

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("bakery");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to load products" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).populate("bakery");
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const productsByBakery = async (req, res) => {
  try {
    const bakeryId = req.params.bakeryId;
    const products = await Product.find({ bakery: bakeryId }).populate("bakery");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bakery products" });
  }
};
