import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function OrderTracker(){
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders");
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        if (err.response?.status === 401) {
          nav("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
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
        <div style={{textAlign: 'center', padding: '60px'}}>
          <div style={{fontSize: '18px', color: '#8b1533'}}>Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="page container">
      <h1 style={{fontSize: '32px', color: '#8b1533', marginBottom: '32px', textAlign: 'center'}}>
        My Orders
      </h1>
      
      {orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          background: '#fff0f2',
          borderRadius: '16px',
          border: '1px solid #f1e6e9'
        }}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>📦</div>
          <h3 style={{color: '#8b1533', marginBottom: '12px'}}>No orders yet</h3>
          <p style={{color: '#6b6b6b', marginBottom: '24px'}}>
            Start shopping to see your orders here
          </p>
          <button 
            className="btn"
            onClick={() => nav('/bakeries')}
            style={{padding: '12px 24px'}}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
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
                  <h3 style={{color: '#8b1533', marginBottom: '4px'}}>
                    Order #{order._id?.slice(-8)}
                  </h3>
                  <p style={{color: '#6b6b6b', fontSize: '14px'}}>
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
                  <span style={{fontSize: '16px'}}>{getStatusIcon(order.status)}</span>
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

              <div style={{marginBottom: '16px'}}>
                <h4 style={{color: '#8b1533', marginBottom: '8px'}}>Items:</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
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
                        <span style={{fontWeight: '500'}}>{item.product?.name || 'Product'}</span>
                        {item.customization && (
                          <div style={{fontSize: '12px', color: '#6b6b6b'}}>
                            Customization: {item.customization}
                          </div>
                        )}
                      </div>
                      <div style={{textAlign: 'right'}}>
                        <div style={{fontWeight: '600'}}>Qty: {item.quantity}</div>
                        <div style={{color: '#8b1533', fontWeight: '600'}}>₹{item.price}</div>
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
                  <div style={{color: '#6b6b6b', fontSize: '14px'}}>Total Amount</div>
                  <div style={{fontSize: '20px', fontWeight: 'bold', color: '#8b1533'}}>
                    ₹{order.totalAmount}
                  </div>
                </div>
                <div style={{display: 'flex', gap: '12px'}}>
                  <button
                    onClick={() => nav(`/order/${order._id}`)}
                    className="btn"
                    style={{padding: '10px 20px', fontSize: '14px'}}
                  >
                    Track Order
                  </button>
                  {order.status?.toLowerCase() === 'delivered' && (
                    <button
                      onClick={() => {
                        // Reorder functionality
                        alert('Reorder feature coming soon!');
                      }}
                      style={{
                        background: 'transparent',
                        border: '2px solid #8b1533',
                        color: '#8b1533',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </div>
        </div>
      ))}
        </div>
      )}
    </main>
  );
}
