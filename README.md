# Whisk Layers - Bakery Ordering App

A full-stack bakery ordering application built with React and Node.js.

## Features

- User authentication (register/login)
- Browse bakeries and products
- Add products to cart with customization
- Order tracking
- User profile management

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- Leaflet for maps

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/whisklayers
   JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The client will run on http://localhost:3000

### Production Build

To build the client for production:
```bash
cd client
npm run build
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/bakeries` - Get all bakeries
- `GET /api/products` - Get all products
- `GET /api/products/bakery/:bakeryId` - Get products by bakery
- `POST /api/cart/add` - Add item to cart (requires auth)
- `GET /api/cart` - Get user's cart (requires auth)
- `DELETE /api/cart/:id` - Remove item from cart (requires auth)
- `POST /api/orders` - Place order (requires auth)
- `GET /api/orders` - Get user's orders (requires auth)

## Project Structure

```
whisk-layers/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── styles/        # CSS files
│   │   └── api.js         # API configuration
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── controllers/       # Route handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── config/           # Configuration files
└── README.md
```

## Issues Fixed

The following issues were identified and resolved:

1. **Import path mismatches**: Fixed incorrect import paths in route files (cartModel.js → Cart.js, etc.)
2. **Middleware export mismatch**: Fixed auth middleware import (protect → auth)
3. **Database model inconsistencies**: Updated Cart and Order models to match route usage
4. **Missing environment variables**: Created .env.example for required configuration

## 🎯 NEW: Admin Dashboard Feature

The app now includes a complete **Admin Dashboard** for bakery owners and managers!

### Admin Dashboard Features
- ✅ View all orders received by your bakery
- ✅ See order details including customer info and delivery address
- ✅ View item quantities and customization messages
- ✅ Accept or reject orders with one click
- ✅ Real-time status updates
- ✅ Responsive design for all devices

### Accessing Admin Dashboard
1. Login to your account
2. Click the **"📊 Admin"** button in the navbar
3. Enter your Bakery ID
4. Click "Load Orders" to see all pending orders
5. Use Accept/Reject buttons to manage orders

### Admin Features Documentation
- **Quick Start**: See `QUICK_START.md` for 5-minute setup
- **Full Guide**: See `ADMIN_DASHBOARD_GUIDE.md` for complete API documentation
- **Verification**: Run `node setup-admin-dashboard.js` to verify installation

### API Endpoints (Admin)
```
GET  /api/orders/admin/bakery/:bakeryId      # Get orders for your bakery
PATCH /api/orders/admin/status/:orderId      # Accept/Reject orders
```

### Database Schema Updates
Orders now include:
- `bakery`: ObjectId reference to the bakery
- `adminStatus`: Can be "Pending", "Accepted", or "Rejected"

---

## Development Notes

- The app uses fallback data for bakeries if the API is not available
- Authentication is handled via JWT tokens stored in localStorage
- The server includes CORS configuration for cross-origin requests
- Images are served from the public/images directory
- Admin features require valid JWT authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📖 Documentation Files

- `README.md` - Main project overview (this file)
- `QUICK_START.md` - 5-minute quick start guide
- `ADMIN_DASHBOARD_GUIDE.md` - Complete technical documentation
- `IMPLEMENTATION_SUMMARY.md` - Feature implementation details
- `setup-admin-dashboard.js` - Automated setup verification script
