import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/global.css";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          nav("/login");
          return;
        }

        const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(savedUser);

        // Fetch user orders
        try {
          const { data } = await API.get("/orders");
          setOrders(data || []);
        } catch (err) {
          console.error("Failed to fetch orders:", err);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [nav]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#ff9800';
      case 'confirmed': return '#2196f3';
      case 'preparing': return '#9c27b0';
      case 'out for delivery': return '#ff5722';
      case 'delivered': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#6b6b6b';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'preparing': return '👨‍🍳';
      case 'out for delivery': return '🚚';
      case 'delivered': return '🎉';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  if (loading) {
    return (
      <div className="page container">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '18px', color: '#8b1533' }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const recentOrders = orders.slice(0, 5);
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = orders.filter(o => o.status?.toLowerCase() === 'pending' || o.status?.toLowerCase() === 'placed').length;

  return (
    <main className="page container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', color: '#8b1533', marginBottom: '8px' }}>
          My Dashboard
        </h1>
        <p style={{ color: '#6b6b6b' }}>Welcome back, {user?.name || 'User'}!</p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        borderBottom: '2px solid #f1e6e9',
        paddingBottom: '12px'
      }}>
        <button
          onClick={() => setActiveTab("overview")}
          style={{
            padding: '12px 24px',
            background: activeTab === "overview" ? '#8b1533' : 'transparent',
            color: activeTab === "overview" ? '#fff' : '#8b1533',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          style={{
            padding: '12px 24px',
            background: activeTab === "orders" ? '#8b1533' : 'transparent',
            color: activeTab === "orders" ? '#fff' : '#8b1533',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          My Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          style={{
            padding: '12px 24px',
            background: activeTab === "profile" ? '#8b1533' : 'transparent',
            color: activeTab === "profile" ? '#fff' : '#8b1533',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          Profile
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📦</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b1533', marginBottom: '4px' }}>
                {orders.length}
              </div>
              <div style={{ color: '#6b6b6b' }}>Total Orders</div>
            </div>
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b1533', marginBottom: '4px' }}>
                {pendingOrders}
              </div>
              <div style={{ color: '#6b6b6b' }}>Pending Orders</div>
            </div>
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b1533', marginBottom: '4px' }}>
                ₹{totalSpent.toLocaleString()}
              </div>
              <div style={{ color: '#6b6b6b' }}>Total Spent</div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ color: '#8b1533', marginBottom: '20px' }}>Recent Orders</h2>
            {recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                <p style={{ color: '#6b6b6b', marginBottom: '24px' }}>No orders yet</p>
                <button className="btn" onClick={() => nav('/bakeries')}>
                  Start Shopping
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentOrders.map(order => (
                  <div
                    key={order._id}
                    style={{
                      padding: '16px',
                      background: '#f8f9fa',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => nav(`/order/${order._id}`)}
                  >
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        Order #{order._id?.slice(-8)}
                      </div>
                      <div style={{ color: '#6b6b6b', fontSize: '14px' }}>
                        {new Date(order.createdAt).toLocaleDateString()} • ₹{order.totalAmount}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      background: `${getStatusColor(order.status)}20`,
                      border: `1px solid ${getStatusColor(order.status)}40`
                    }}>
                      <span>{getStatusIcon(order.status)}</span>
                      <span style={{
                        color: getStatusColor(order.status),
                        fontWeight: '600',
                        fontSize: '12px',
                        textTransform: 'capitalize'
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {orders.length > 5 && (
              <button
                onClick={() => setActiveTab("orders")}
                style={{
                  marginTop: '20px',
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  border: '2px solid #8b1533',
                  color: '#8b1533',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                View All Orders
              </button>
            )}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div>
          {orders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
              <h3 style={{ color: '#8b1533', marginBottom: '12px' }}>No orders yet</h3>
              <p style={{ color: '#6b6b6b', marginBottom: '24px' }}>
                Start shopping to see your orders here
              </p>
              <button className="btn" onClick={() => nav('/bakeries')}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.map(order => (
                <div
                  key={order._id}
                  className="card"
                  style={{
                    padding: '24px',
                    border: '1px solid #f1e6e9',
                    borderRadius: '16px',
                    background: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{ color: '#8b1533', marginBottom: '4px' }}>
                        Order #{order._id?.slice(-8)}
                      </h3>
                      <p style={{ color: '#6b6b6b', fontSize: '14px' }}>
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      background: `${getStatusColor(order.status)}20`,
                      border: `1px solid ${getStatusColor(order.status)}40`
                    }}>
                      <span style={{ fontSize: '16px' }}>{getStatusIcon(order.status)}</span>
                      <span style={{
                        color: getStatusColor(order.status),
                        fontWeight: '600',
                        fontSize: '14px',
                        textTransform: 'capitalize'
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ color: '#8b1533', marginBottom: '8px' }}>Items:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {order.orderItems?.map((item, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: '#f8f9fa',
                          borderRadius: '8px'
                        }}>
                          <div>
                            <span style={{ fontWeight: '500' }}>{item.product?.name || 'Product'}</span>
                            {item.customization && (
                              <div style={{ fontSize: '12px', color: '#6b6b6b' }}>
                                Customization: {item.customization}
                              </div>
                            )}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: '600' }}>Qty: {item.quantity}</div>
                            <div style={{ color: '#8b1533', fontWeight: '600' }}>₹{item.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid #f1e6e9'
                  }}>
                    <div>
                      <div style={{ color: '#6b6b6b', fontSize: '14px' }}>Total Amount</div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b1533' }}>
                        ₹{order.totalAmount}
                      </div>
                    </div>
                    <button
                      onClick={() => nav(`/order/${order._id}`)}
                      className="btn"
                      style={{ padding: '10px 20px', fontSize: '14px' }}
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '32px' }}>
            <img
              src="/images/profile.png"
              alt="profile"
              style={{ width: '120px', height: '120px', borderRadius: '16px' }}
            />
            <div>
              <h2 style={{ color: '#8b1533', marginBottom: '8px' }}>{user?.name || 'User'}</h2>
              <p style={{ color: '#6b6b6b', marginBottom: '4px' }}>{user?.email || 'email@example.com'}</p>
              {user?.phone && (
                <p style={{ color: '#6b6b6b' }}>{user.phone}</p>
              )}
              {user?.role && (
                <div style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: user.role === 'admin' ? '#8b1533' : '#f1e6e9',
                  color: user.role === 'admin' ? '#fff' : '#8b1533',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {user.role}
                </div>
              )}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '12px' }}>
              <div style={{ color: '#6b6b6b', fontSize: '14px', marginBottom: '4px' }}>Total Orders</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b1533' }}>{orders.length}</div>
            </div>
            <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '12px' }}>
              <div style={{ color: '#6b6b6b', fontSize: '14px', marginBottom: '4px' }}>Total Spent</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b1533' }}>
                ₹{totalSpent.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

