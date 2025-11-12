// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const auth = (req, res, next) => {
  console.log('=== AUTH middleware ===', req.header("Authorization"));
  const header = req.header("Authorization") || req.header("x-auth-token");
  if (!header) return res.status(401).json({ message: "No token provided" });
  const token = header.startsWith("Bearer ") ? header.replace("Bearer ", "") : header;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.user = { 
      id: decoded.id || decoded._id || decoded.userId,
      _id: decoded.id || decoded._id || decoded.userId 
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};
