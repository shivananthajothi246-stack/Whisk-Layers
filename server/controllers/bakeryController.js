// server/controllers/bakeryController.js
import Bakery from "../models/Bakery.js";

export const listBakeries = async (req, res) => {
  try {
    const bakeries = await Bakery.find();
    res.json(bakeries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bakeries" });
  }
};
