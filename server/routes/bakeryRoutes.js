// server/routes/bakeryRoutes.js
import express from "express";
import { listBakeries } from "../controllers/bakeryController.js";
const router = express.Router();
router.get("/", listBakeries);
export default router;
