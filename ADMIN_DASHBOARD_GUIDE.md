# Admin Dashboard Implementation Guide

## Overview
This document describes the **Admin Dashboard** feature that has been added to the Whisk Layers bakery application. The admin dashboard allows bakery owners and administrators to:

1. ✓ View all orders received by their bakery
2. ✓ See order details including customer info, items, quantities, and customization messages
3. ✓ Accept or reject orders
4. ✓ Track order status in real-time

---

## Changes Made

### Backend Changes

#### 1. **Order Model Update** (`server/models/Order.js`)
Added two new fields:
```javascript
bakery: { type: mongoose.Schema.Types.ObjectId, ref: "Bakery" }, // Identifies which bakery received the order
adminStatus: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }
```

#### 2. **Order Controller Updates** (`server/controllers/orderController.js`)
**Modified function:**
- `createOrder()` - Now captures bakery ID from the first product in the cart and stores it with the order

**New functions:**
- `getAdminOrders(bakeryId)` - Retrieves all orders for a specific bakery (GET `/orders/admin/bakery/:bakeryId`)
- `updateOrderAdminStatus(orderId, adminStatus)` - Updates order status to Accepted or Rejected (PATCH `/orders/admin/status/:orderId`)

#### 3. **Order Routes Updates** (`server/routes/orderRoutes.js`)
Added new admin routes:
```javascript
GET  /api/orders/admin/bakery/:bakeryId      // Fetch all orders for a bakery
PATCH /api/orders/admin/status/:orderId      // Update order admin status
```

### Frontend Changes

#### 1. **New Admin Dashboard Page** (`client/src/pages/AdminDashboard.js`)
Complete admin dashboard component with:
- Bakery ID input field
- Load orders button
- Display of all orders with:
  - Customer name, email, phone
  - Order items with quantity, price, and customization details
  - Delivery address
  - Total amount and payment method
  - Accept/Reject buttons (for Pending orders)
  - Real-time status updates

#### 2. **Admin Dashboard Styles** (`client/src/styles/AdminDashboard.css`)
Professional styling including:
- Color-coded status badges (Pending=Yellow, Accepted=Green, Rejected=Red)
- Responsive design for mobile and desktop
- Interactive buttons and hover effects
- Customization message highlighting

#### 3. **App.js Route Addition**
Added new route:
```javascript
<Route path="/admin-dashboard" element={<AdminDashboard />} />
```

#### 4. **Navbar Update** (`client/src/components/Navbar.js`)
Added "📊 Admin" button visible only to logged-in users:
```javascript
{token && <Link to="/admin-dashboard" style={{color:'#8b1533',background:'#fff0f2',padding:'6px 10px',borderRadius:8}}>📊 Admin</Link>}
```

---

## How to Use

### For Admin Users:

1. **Login** to your account
2. Click the **"📊 Admin"** button in the navbar (appears only when logged in)
3. You'll see the Admin Dashboard
4. Enter your **Bakery ID** (get it from your bakery setup or localStorage if saved)
5. Click **"Load Orders"** to fetch all orders
6. View order details:
   - Customer information
   - Each item's quantity and customization message
   - Total amount
   - Payment status
7. **Accept** or **Reject** pending orders using the buttons
8. Status updates in real-time

---

## API Documentation

### Get Orders for Admin (Bakery)
```http
GET /api/orders/admin/bakery/:bakeryId
Authorization: Bearer <token>

Response:
[
  {
    _id: "order_id",
    user: {
      _id: "user_id",
      name: "Customer Name",
      email: "customer@email.com",
      phone: "9876543210"
    },
    bakery: "bakery_id",
    orderItems: [
      {
        product: { _id: "prod_id", name: "Chocolate Cake" },
        quantity: 2,
        customization: "Less sugar, extra frosting",
        price: 500
      }
    ],
    totalAmount: 1000,
    address: "123 Main St",
    status: "Placed",
    adminStatus: "Pending", // or "Accepted" or "Rejected"
    paymentMethod: "cash",
    paymentStatus: "Paid",
    createdAt: "2025-11-12T10:00:00Z"
  }
]
```

### Update Order Admin Status
```http
PATCH /api/orders/admin/status/:orderId
Authorization: Bearer <token>

Body:
{
  "adminStatus": "Accepted" // or "Rejected"
}

Response:
{
  _id: "order_id",
  user: {...},
  bakery: "bakery_id",
  orderItems: [...],
  adminStatus: "Accepted",
  ...
}
```

---

## Database Schema

### Order Schema (Updated)
```javascript
{
  user: ObjectId (ref: User),
  bakery: ObjectId (ref: Bakery),              // NEW
  orderItems: [
    {
      product: ObjectId,
      quantity: Number,
      customization: String,
      price: Number
    }
  ],
  totalAmount: Number,
  address: String,
  status: String (default: "Pending"),
  adminStatus: String (enum: ["Pending", "Accepted", "Rejected"]), // NEW
  paymentMethod: String,
  paymentStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## How Bakery Link Works

**Order ↔ Bakery Connection:**
1. When an order is created, the system extracts the bakery ID from the products in the cart
2. The bakery ID is stored in the order's `bakery` field
3. Admins can then filter orders by their bakery ID

**Example Flow:**
1. User adds products from "Sweet Bakery" to cart
2. User places order
3. Backend extracts bakery ID from product and stores it
4. Admin logs in and enters their bakery ID in the dashboard
5. Dashboard fetches all orders with matching bakery ID

---

## Frontend Setup

### StoringBakery ID Locally (Optional but Recommended)

In the AdminDashboard component, the bakery ID is saved to localStorage for convenience:

```javascript
localStorage.setItem("bakeryId", bakeryId);
```

You can set this manually by:
1. Going to Admin Dashboard
2. Entering your bakery ID
3. It will be automatically saved for next time

---

## Testing the Feature

### Manual Testing Steps:

1. **Backend Testing:**
   ```bash
   # Terminal 1: Start server
   cd server
   npm install
   npm start
   ```

2. **Frontend Testing:**
   ```bash
   # Terminal 2: Start client
   cd client
   npm install
   npm start
   ```

3. **Create a Test Order:**
   - Log in as a customer
   - Add products from a bakery to cart
   - Complete checkout
   - Note the bakery ID (check MongoDB or API response)

4. **Access Admin Dashboard:**
   - Log in (can be same or different user)
   - Click "📊 Admin" button
   - Enter the bakery ID
   - Click "Load Orders"
   - Should see the order you just created

5. **Accept/Reject Order:**
   - Click "Accept" or "Reject" button
   - See status change in real-time
   - Verify in MongoDB that `adminStatus` changed

---

## Environment Variables

Ensure your `.env` file includes:

```
REACT_APP_API=http://localhost:5000/api
JWT_SECRET=your_secret_key
```

---

## Important Notes

1. **Authentication Required:** All admin endpoints require a valid JWT token
2. **Bakery Association:** Orders are linked to bakeries through products
3. **Status Flow:** adminStatus starts as "Pending" and can be changed to "Accepted" or "Rejected"
4. **Real-time Updates:** The dashboard doesn't auto-refresh; click "Load Orders" to refresh
5. **Single Bakery Per Order:** Currently assumes all products in an order are from one bakery

---

## Future Enhancements

Potential improvements:
1. ✗ Role-based access control (Admin, Owner, Manager roles)
2. ✗ Real-time order notifications (WebSocket)
3. ✗ Order history and analytics
4. ✗ Bulk order operations
5. ✗ Custom order filters (by date, customer, status)
6. ✗ Print/Export order details
7. ✗ Integration with delivery partners

---

## Troubleshooting

### Issue: "No orders received yet"
- ✓ Verify bakery ID is correct
- ✓ Ensure orders were created with products from this bakery
- ✓ Check MongoDB: `db.orders.find({ bakery: ObjectId("bakeryId") })`

### Issue: "Not logged in" error
- ✓ Token expired - log in again
- ✓ Check localStorage for "token" key
- ✓ Ensure Authorization header is being sent

### Issue: Accept/Reject buttons not working
- ✓ Check browser console for errors
- ✓ Verify backend is running
- ✓ Check order status is "Pending"

---

## Files Modified/Created

### New Files:
- `client/src/pages/AdminDashboard.js`
- `client/src/styles/AdminDashboard.css`
- `ADMIN_DASHBOARD_GUIDE.md` (this file)

### Modified Files:
- `server/models/Order.js` - Added bakery and adminStatus fields
- `server/controllers/orderController.js` - Added getAdminOrders and updateOrderAdminStatus functions
- `server/routes/orderRoutes.js` - Added admin routes
- `client/src/App.js` - Added AdminDashboard route
- `client/src/components/Navbar.js` - Added Admin button

---

## Contact & Support

For issues or questions about the admin dashboard:
1. Check the troubleshooting section above
2. Review API response errors in browser console
3. Check server logs for backend errors
4. Verify database connections and data

---

**Last Updated:** November 12, 2025
**Version:** 1.0
