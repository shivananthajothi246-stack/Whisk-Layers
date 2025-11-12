// server/controllers/cartController.js
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return res.json({ items: [] });
    res.json({ items: cart.items });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, customization = "" } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx > -1) {
      cart.items[idx].quantity = Number(cart.items[idx].quantity) + Number(quantity);
      cart.items[idx].customization = customization || cart.items[idx].customization;
    } else {
      cart.items.push({ product: productId, quantity, customization });
    }
    await cart.save();
    const populated = await cart.populate("items.product");
    res.json({ msg: "Added", cart: populated });
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const idx = cart.items.findIndex(i => i._id.toString() === itemId);
    if (idx === -1) return res.status(404).json({ message: "Item not found" });
    cart.items[idx].quantity = Number(quantity);
    await cart.save();
    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update item" });
  }
};

export const removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.items = cart.items.filter(i => i._id.toString() !== itemId);
    await cart.save();
    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
};
