import React, { useState, useEffect } from "react";
import API from "../api";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bakeryId, setBakeryId] = useState("");
  const [userBakeries, setUserBakeries] = useState([]);

  // Fetch bakeries for current user (for dropdown)
  useEffect(() => {
    fetchUserBakeries();
  }, []);

  const fetchUserBakeries = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not logged in. Please log in first.");
        return;
      }
      
      // Assuming there's a bakery API to get user's bakeries
      // For now, we'll use a simple approach - get bakeryId from localStorage if saved
      const savedBakeryId = localStorage.getItem("bakeryId");
      if (savedBakeryId) {
        setBakeryId(savedBakeryId);
        fetchOrders(savedBakeryId);
      }
    } catch (err) {
      console.error("Error fetching bakeries:", err);
    }
  };

  const fetchOrders = async (bId) => {
    if (!bId) {
      setError("Please select a bakery");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/orders/admin/bakery/${bId}`);
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await API.patch(`/orders/admin/status/${orderId}`, {
        adminStatus: newStatus
      });
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? response.data : order
      ));
      alert(`Order ${newStatus.toLowerCase()} successfully!`);
    } catch (err) {
      alert("Failed to update order status: " + (err.response?.data?.message || err.message));
      console.error("Error updating status:", err);
    }
  };

  const handleBakeryChange = (e) => {
    const bId = e.target.value;
    setBakeryId(bId);
    if (bId) {
      localStorage.setItem("bakeryId", bId);
      fetchOrders(bId);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage orders received by your bakery</p>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-controls">
        <label>
          Select Bakery:
          <input 
            type="text" 
            placeholder="Enter Bakery ID or paste from localStorage"
            value={bakeryId}
            onChange={(e) => setBakeryId(e.target.value)}
          />
        </label>
        <button onClick={() => fetchOrders(bakeryId)} disabled={loading}>
          {loading ? "Loading..." : "Load Orders"}
        </button>
      </div>

      <div className="admin-orders-container">
        {loading && <p>Loading orders...</p>}
        
        {!loading && orders.length === 0 && (
          <p className="no-orders">No orders received yet.</p>
        )}

        {!loading && orders.length > 0 && (
          <div className="orders-list">
            <h2>Orders ({orders.length})</h2>
            {orders.map(order => (
              <div key={order._id} className={`order-card admin-order-card status-${order.adminStatus}`}>
                <div className="order-header">
                  <h3>Order ID: {order._id.slice(-8)}</h3>
                  <span className={`admin-status-badge status-${order.adminStatus}`}>
                    {order.adminStatus}
                  </span>
                </div>

                <div className="order-customer">
                  <strong>Customer:</strong> {order.user?.name || "Unknown"}
                  <br />
                  <strong>Email:</strong> {order.user?.email || "N/A"}
                  <br />
                  <strong>Phone:</strong> {order.user?.phone || "N/A"}
                </div>

                <div className="order-address">
                  <strong>Delivery Address:</strong> {order.address}
                </div>

                <div className="order-items">
                  <strong>Items:</strong>
                  <ul>
                    {order.orderItems?.map((item, idx) => (
                      <li key={idx}>
                        <span className="item-name">{item.product?.name || "Product"}</span>
                        <span className="item-qty">Qty: {item.quantity}</span>
                        <span className="item-price">₹{item.price}</span>
                        {item.customization && (
                          <div className="item-customization">
                            <strong>Customization:</strong> {item.customization}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="order-total">
                  <strong>Total Amount:</strong> ₹{order.totalAmount}
                </div>

                <div className="order-payment">
                  <strong>Payment Method:</strong> {order.paymentMethod || "Cash"}
                  <br />
                  <strong>Payment Status:</strong> {order.paymentStatus}
                </div>

                <div className="order-timestamp">
                  <small>Placed on: {new Date(order.createdAt).toLocaleString()}</small>
                </div>

                <div className="admin-actions">
                  {order.adminStatus === "Pending" && (
                    <>
                      <button 
                        className="btn-accept"
                        onClick={() => handleStatusUpdate(order._id, "Accepted")}
                      >
                        ✓ Accept
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => handleStatusUpdate(order._id, "Rejected")}
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}
                  {order.adminStatus === "Accepted" && (
                    <span className="action-label">✓ Order Accepted</span>
                  )}
                  {order.adminStatus === "Rejected" && (
                    <span className="action-label">✕ Order Rejected</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
