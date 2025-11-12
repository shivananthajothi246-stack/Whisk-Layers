// client/src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BakeryList from "./pages/BakeryList";
import BakeryProducts from "./pages/BakeryProducts";
import Product from "./pages/Product";
import Customization from "./pages/Customization";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess"; // <-- Used for the new status page
import OrderTracker from "./pages/OrderTracker";
import OrderStatus from "./pages/OrderStatus";
import AdminDashboard from "./pages/AdminDashboard"; // 🆕 Admin Dashboard
import UserDashboard from "./pages/UserDashboard"; // 🆕 User Dashboard
import Inbox from "./pages/Inbox";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Splash from "./pages/Splash";
import Landing from "./pages/Landing";

import "./styles/global.css";
import "./App.css";

export default function App(){
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                {/* Splash as the initial screen */}
                <Route path="/" element={<Splash />} />
                <Route path="/landing" element={<Landing />} />

                <Route path="/home" element={<Home />} />
                <Route path="/bakeries" element={<BakeryList />} />
                <Route path="/bakery/:id" element={<BakeryProducts />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/customize/:id" element={<Customization />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/success" element={<PaymentSuccess />} />
                <Route path="/orders" element={<OrderTracker />} />
                <Route path="/order/:id" element={<OrderStatus />} />
                
                {/* CRITICAL CHANGE:
                  The Order-Status route is now handled by the updated PaymentSuccess component,
                  which is responsible for fetching and displaying the final order and payment status.
                */}
                <Route path="/order-status/:id" element={<PaymentSuccess />} /> 
                
                <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* 🆕 Admin Dashboard Route */}
                <Route path="/dashboard" element={<UserDashboard />} /> {/* 🆕 User Dashboard Route */}
                
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}