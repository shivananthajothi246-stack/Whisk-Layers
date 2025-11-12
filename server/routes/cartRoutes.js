import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { auth as protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add to cart
router.post("/add", protect, async (req, res) => {
  const { productId, quantity, customization } = req.body;
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Unauthorized: Please login to add items to cart." });
  }
  console.log("Add to cart request:", { productId, quantity, customization, userId: req.user._id });

  try {
    const product = await Product.findById(productId);
    console.log("Product found:", product);
    
    if (!product) {
      console.log("Product not found for ID:", productId);
      return res.status(404).json({ message: "Product not found" });
    }

    let cartItem = await Cart.findOne({ user: req.user._id, product: productId });
    console.log("Existing cart item:", cartItem);

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.customization = customization || cartItem.customization;
      cartItem.price = product.price * cartItem.quantity;
      await cartItem.save();
      console.log("Updated cart item:", cartItem);
    } else {
      cartItem = await Cart.create({
        user: req.user._id,
        product: productId,
        quantity,
        customization,
        price: product.price * quantity
      });
      console.log("Created new cart item:", cartItem);
    }

    res.json(cartItem);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get cart
router.get("/", protect, async (req, res) => {
  const cart = await Cart.find({ user: req.user._id }).populate("product");
  res.json(cart);
});

// Update item quantity
router.put("/:id", protect, async (req, res) => {
  const { quantity } = req.body;
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) return res.status(404).json({ message: "Item not found" });
    
    const product = await Product.findById(cartItem.product);
    if (!product) return res.status(404).json({ message: "Product not found" });
    
    cartItem.quantity = quantity;
    cartItem.price = product.price * quantity;
    await cartItem.save();
    
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove item
router.delete("/:id", protect, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Removed from cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
