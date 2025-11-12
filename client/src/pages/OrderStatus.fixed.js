import React, { useEffect, useState } from "react";
import API from "../api";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const orderSteps = [
    { status: 'pending', label: 'Order Placed', icon: '📝', description: 'Your order has been received' },
    { status: 'confirmed', label: 'Order Confirmed', icon: '✅', description: 'We\'ve confirmed your order' },
    { status: 'preparing', label: 'Preparing', icon: '👨‍🍳', description: 'Our baker is preparing your order' },
    { status: 'out for delivery', label: 'Out for Delivery', icon: '🚚', description: 'Your order is on its way' },
    { status: 'delivered', label: 'Delivered', icon: '🎉', description: 'Order delivered successfully' }
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data);
        // Find current step based on order status
        const stepIndex = orderSteps.findIndex(step => 
          step.status.toLowerCase() === res.data.status?.toLowerCase()
        );
        setCurrentStep(stepIndex >= 0 ? stepIndex : 0);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

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

  if (loading) {
    return (
      <div className="page container">
        <div style={{textAlign: 'center', padding: '60px'}}>
          <div style={{fontSize: '18px', color: '#8b1533'}}>Loading order details...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page container">
        <div style={{textAlign: 'center', padding: '60px'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>❌</div>
          <h3 style={{color: '#8b1533', marginBottom: '12px'}}>Order not found</h3>
          <p style={{color: '#6b6b6b', marginBottom: '24px'}}>
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <button 
            className="btn"
            onClick={() => navigate('/orders')}
            style={{padding: '12px 24px'}}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="page container">
      <div style={{marginBottom: '32px'}}>
        <button
          onClick={() => navigate('/orders')}
          style={{
            background: 'transparent',
            border: '2px solid #8b1533',
            color: '#8b1533',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '20px'
          }}
        >
          ← Back to Orders
        </button>
        <h1 style={{fontSize: '28px', color: '#8b1533', marginBottom: '8px'}}>
          Order #{order._id?.slice(-8)}
        </h1>
        <p style={{color: '#6b6b6b'}}>
          Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
        </p>
        <div style={{marginTop: '8px', marginBottom: '8px'}}>
          <span style={{
            background: order.paymentStatus === 'Paid' ? '#e0ffe0' : '#fff0f0',
            color: order.paymentStatus === 'Paid' ? '#388e3c' : '#d32f2f',
            padding: '4px 12px',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '15px',
            border: order.paymentStatus === 'Paid' ? '1px solid #b2dfdb' : '1px solid #ffcdd2'
          }}>
            Payment Status: {order.paymentStatus || 'Pending'}
          </span>
        </div>
      </div>

      {/* Order Status Progress */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #f1e6e9',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{color: '#8b1533', marginBottom: '20px', textAlign: 'center'}}>
          Order Progress
        </h3>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          {orderSteps.map((step, index) => (
            <div key={index} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: index <= currentStep ? getStatusColor(order.status) : '#e0e0e0',
                color: index <= currentStep ? 'white' : '#9e9e9e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                marginBottom: '8px',
                border: `3px solid ${index <= currentStep ? getStatusColor(order.status) : '#e0e0e0'}`
              }}>
                {index <= currentStep ? step.icon : '⏳'}
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: index <= currentStep ? '#8b1533' : '#9e9e9e',
                  marginBottom: '4px'
                }}>
                  {step.label}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#6b6b6b',
                  lineHeight: '1.3'
                }}>
                  {step.description}
                </div>
              </div>
              {index < orderSteps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: '25px',
                  left: 'calc(50% + 25px)',
                  width: 'calc(100% - 50px)',
                  height: '2px',
                  background: index < currentStep ? getStatusColor(order.status) : '#e0e0e0',
                  zIndex: -1
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Details */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #f1e6e9',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{color: '#8b1533', marginBottom: '16px'}}>Order Details</h3>
        <div style={{marginBottom: '12px'}}>
          <span>
            Payment: {order.paymentStatus || 'Pending'}
          </span>
        </div>
        <div style={{marginBottom: '20px'}}>
          <h4 style={{color: '#8b1533', marginBottom: '12px'}}>Items Ordered:</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {order.orderItems?.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                background: '#f8f9fa',
                borderRadius: '12px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: '600', marginBottom: '4px'}}>
                    {item.product?.name || 'Product'}
                  </div>
                  {item.customization && (
                    <div style={{fontSize: '14px', color: '#6b6b6b', marginBottom: '4px'}}>
                      Customization: {item.customization}
                    </div>
                  )}
                  <div style={{fontSize: '14px', color: '#6b6b6b'}}>
                    Quantity: {item.quantity}
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: '18px', fontWeight: 'bold', color: '#8b1533'}}>
                    ₹{item.price}
                  </div>
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
          borderTop: '1px solid #e9ecef'
        }}>
          <div>
            <div style={{color: '#6b6b6b', fontSize: '14px'}}>Total Amount</div>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#8b1533'}}>
              ₹{order.totalAmount}
            </div>
          </div>
          <div style={{
            padding: '8px 16px',
            borderRadius: '20px',
            background: `${getStatusColor(order.status)}20`,
            border: `1px solid ${getStatusColor(order.status)}40`
          }}>
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
      </div>

      {/* Estimated Delivery */}
      {order.status?.toLowerCase() !== 'delivered' && (
        <>
          <div style={{
            background: 'linear-gradient(135deg, #fff0f2 0%, #f8f9fa 100%)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #f1e6e9',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <h3 style={{color: '#8b1533', marginBottom: '12px'}}>Estimated Delivery</h3>
            <p style={{color: '#6b6b6b', marginBottom: '16px'}}>
              Your order will be delivered within 30-45 minutes
            </p>
            <button
              onClick={async () => {
                // Simulate advancing order status for demo
                const statuses = orderSteps.map(s => s.status);
                const currentIdx = statuses.findIndex(s => s.toLowerCase() === order.status?.toLowerCase());
                if (currentIdx < statuses.length - 1) {
                  const nextStatus = statuses[currentIdx + 1];
                  try {
                    await API.patch(`/orders/${order._id}`, { status: nextStatus });
                    setOrder({ ...order, status: nextStatus });
                    setCurrentStep(currentIdx + 1);
                  } catch (err) {
                    const msg = err.response?.data?.message || err.message || 'Failed to update order status.';
                    alert('Failed to update order status: ' + msg);
                  }
                } else {
                  alert('Order already delivered!');
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'white',
                borderRadius: '20px',
                border: '1px solid #e9ecef',
                color: '#8b1533',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              <span style={{fontSize: '16px'}}>🚚</span>
              {order.status?.toLowerCase() === 'delivered' ? 'Order Delivered' : 'Advance Tracking'}
            </button>
          </div>
          {/* SVG Moving Map Simulation */}
          <div style={{
            background: '#fff',
            border: '1px solid #f1e6e9',
            borderRadius: '16px',
            margin: '0 auto 24px auto',
            maxWidth: 500,
            height: 220,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
          }}>
            <MovingMap orderStep={currentStep} />
          </div>
        </>
      )}
    </main>
  );
}

// MovingMap: Simulated map with moving marker for order tracking
export function MovingMap({ orderStep }) {
  const path = [
    { x: 30, y: 180 },
    { x: 120, y: 120 },
    { x: 220, y: 100 },
    { x: 350, y: 80 },
    { x: 450, y: 40 }
  ];
  const step = Math.max(0, Math.min(orderStep, path.length - 1));
  return (
    <svg width="100%" height="220" viewBox="0 0 500 220">
      {/* Path line */}
      <polyline points={path.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#8b1533" strokeWidth="4" strokeDasharray="8 8" />
      {/* Bakery marker */}
      <circle cx={path[0].x} cy={path[0].y} r="16" fill="#ffecb3" stroke="#8b1533" strokeWidth="3" />
      <text x={path[0].x} y={path[0].y + 32} textAnchor="middle" fontSize="13" fill="#8b1533">Bakery</text>
      {/* Customer marker */}
      <circle cx={path[path.length-1].x} cy={path[path.length-1].y} r="16" fill="#c8e6c9" stroke="#388e3c" strokeWidth="3" />
      <text x={path[path.length-1].x} y={path[path.length-1].y - 20} textAnchor="middle" fontSize="13" fill="#388e3c">You</text>
      {/* Moving marker */}
      <circle cx={path[step].x} cy={path[step].y} r="14" fill="#8b1533" stroke="#fff" strokeWidth="4" />
      <text x={path[step].x} y={path[step].y + 5} textAnchor="middle" fontSize="18" fill="#fff">🚚</text>
    </svg>
  );
}
