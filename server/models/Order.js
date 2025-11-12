import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: Number,
  customization: String,
  price: Number
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bakery: { type: mongoose.Schema.Types.ObjectId, ref: "Bakery" }, // 🆕 For admin dashboard filtering
  orderItems: [OrderItemSchema],
  totalAmount: Number, // Existing field for order subtotal
  address: String,
  status: { type: String, default: "Pending" },
  adminStatus: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }, // 🆕 For admin accept/reject
  // Existing payment fields
  paymentMethod: { type: String, enum: ['cash', 'online'], default: 'cash' },
  paymentStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
  onlineType: { type: String, enum: ['card', 'upi', null], default: null },

  // 🆕 NEW FIELDS ADDED FOR DETAILED PAYMENT PROCESS
  paymentMode: { type: String, default: 'cash' }, // e.g., Card, UPI, Cash On Delivery
  paymentWay: { type: String, default: 'Exact Change' }, // e.g., Visa, GPay, Exact Change
  finalAmount: { type: Number, default: 0 } // The actual amount paid (matches client side name)
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);