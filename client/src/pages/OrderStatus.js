import React, { useEffect, useState, useRef } from "react";
// Payment options
const paymentModes = [
  { value: 'online', label: 'Online' },
  { value: 'cod', label: 'Cash on Delivery' }
];
const paymentWays = {
  online: [
    { value: 'upi', label: 'UPI' },
    { value: 'card', label: 'Card' },
    { value: 'netbanking', label: 'Netbanking' },
    { value: 'wallet', label: 'Wallet' }
  ],
  cod: [
    { value: 'cash', label: 'Cash' },
    { value: 'upi', label: 'UPI' }
  ]
};
import API from "../api";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderStatus() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  // Always show advanced tracking
  const [autoAdvance, setAutoAdvance] = useState(false);
  // Payment state
  const [showPayment, setShowPayment] = useState(true);
  const [paymentMode, setPaymentMode] = useState('');
  const [paymentWay, setPaymentWay] = useState('');
  // 'pending', 'success', 'failed'
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const intervalRef = useRef(null);

  const orderSteps = [
    { status: 'pending', label: 'Order Placed', icon: '📝', description: 'Your order has been received' },
    { status: 'confirmed', label: 'Order Confirmed', icon: '✅', description: 'We\'ve confirmed your order' },
    { status: 'preparing', label: 'Preparing', icon: '👨‍🍳', description: 'Our baker is preparing your order' },
    { status: 'out for delivery', label: 'Out for Delivery', icon: '🚚', description: 'Your order is on its way' },
    { status: 'delivered', label: 'Delivered', icon: '🎉', description: 'Order delivered successfully' }
  ];

  // If virtual order (fallback cake), animate order status steps
  // Accept both 'virtual_' and fallback cake ids (p1, p2, etc) as virtual
  const isVirtualOrder = id && (id.startsWith('virtual_') || id.startsWith('p'));
  const [virtualStep, setVirtualStep] = useState(0);
  const [virtualAutoAdvance, setVirtualAutoAdvance] = useState(false);
  const virtualIntervalRef = useRef(null);
  useEffect(() => {
    // Only animate if virtual order and tracking is enabled
    if (isVirtualOrder) {
      setVirtualStep(0);
    }
  }, [id, isVirtualOrder]);

  useEffect(() => {
    if (!isVirtualOrder) return;
    if (!virtualAutoAdvance || virtualStep >= orderSteps.length - 1) {
      clearInterval(virtualIntervalRef.current);
      return;
    }
    virtualIntervalRef.current = setInterval(() => {
      setVirtualStep((prev) => {
        if (prev >= orderSteps.length - 1) {
          clearInterval(virtualIntervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(virtualIntervalRef.current);
  }, [virtualAutoAdvance, virtualStep, isVirtualOrder]);
  if (isVirtualOrder) {
    // For cash on delivery, payment is only 'paid' after delivery
    useEffect(() => {
      if (paymentMode === 'cod' && virtualStep === orderSteps.length-1 && paymentStatus !== 'success') {
        setPaymentStatus('success');
      }
    }, [paymentMode, virtualStep, orderSteps.length, paymentStatus]);
    return (
      <div className="order-status-container">
        <h2>Order Tracking</h2>
        <p>Order ID: <b>{id.replace('virtual_', 'ORDER-')}</b></p>
        {/* Payment status always visible after payment attempt */}
        {(!showPayment || paymentStatus !== 'pending') && paymentMode && paymentWay && (
          <div style={{margin:'0 auto 24px auto', maxWidth:400, textAlign:'center'}}>
            <span style={{
              display:'inline-block',
              background: paymentStatus==='success' ? '#4caf50' : paymentStatus==='failed' ? '#e53935' : '#ffb347',
              color: paymentStatus==='success' ? '#fff' : paymentStatus==='failed' ? '#fff' : '#8b1533',
              borderRadius: 20,
              padding: '6px 24px',
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: 1,
              boxShadow: '0 1px 4px #f3e6e9',
              marginBottom: 8
            }}>
              {paymentStatus==='success' ? 'Payment Successful' : paymentStatus==='failed' ? 'Payment Failed' : paymentStatus==='pending' && paymentMode==='cod' ? (virtualStep === orderSteps.length-1 ? 'Payment Pending (COD - will be paid on delivery)' : 'Payment Pending (COD)') : 'Payment Pending'}
            </span>
            <div style={{marginTop:6, color:'#8b1533', fontWeight:500}}>
              Mode: {paymentModes.find(m=>m.value===paymentMode)?.label}, Way: {paymentWays[paymentMode].find(w=>w.value===paymentWay)?.label}
            </div>
          </div>
        )}
        {showPayment && (
          <div style={{background:'#fff', borderRadius:12, boxShadow:'0 2px 8px #f3e6e9', padding:32, maxWidth:400, margin:'32px auto', textAlign:'left'}}>
            <h3 style={{color:'#8b1533', marginBottom:16}}>Payment Details</h3>
            <div style={{marginBottom:16}}>
              <label style={{fontWeight:600}}>Mode of Payment:</label><br/>
              <select value={paymentMode} onChange={e => {setPaymentMode(e.target.value); setPaymentWay('');}} style={{marginTop:6, width:'100%', padding:8, borderRadius:6, border:'1px solid #eee'}}>
                <option value="">Select Mode</option>
                {paymentModes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            {paymentMode && (
              <div style={{marginBottom:16}}>
                <label style={{fontWeight:600}}>Way of Payment:</label><br/>
                <select value={paymentWay} onChange={e => setPaymentWay(e.target.value)} style={{marginTop:6, width:'100%', padding:8, borderRadius:6, border:'1px solid #eee'}}>
                  <option value="">Select Way</option>
                  {paymentWays[paymentMode].map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            )}
            <button className="btn" style={{marginTop:12, width:'100%'}} disabled={!paymentMode || !paymentWay || paymentStatus==='success'}
              onClick={() => {
                setPaymentStatus('pending');
                setTimeout(() => {
                  if (paymentMode === 'online') {
                    setPaymentStatus('success');
                    setShowPayment(false);
                  } else {
                    // For COD, keep status pending until delivered
                    setShowPayment(false);
                  }
                }, 1200);
              }}>
              {paymentStatus==='pending' ? 'Pay Now' : paymentStatus==='success' ? 'Paid' : 'Pay Now'}
            </button>
            {paymentStatus==='pending' && paymentMode && paymentWay && <div style={{marginTop:10, color:'#8b1533'}}>Processing payment...</div>}
            {paymentStatus==='success' && <div style={{marginTop:10, color:'#388e3c', fontWeight:600}}>Payment Successful!</div>}
          </div>
        )}
        {!showPayment && <>
        <button
          className="btn"
          style={{marginBottom: 18, fontSize:15, fontWeight:700, boxShadow:'0 1px 4px #f3e6e9', background: virtualStep === orderSteps.length-1 ? '#4caf50' : undefined, color: virtualStep === orderSteps.length-1 ? '#fff' : undefined, cursor: virtualStep === orderSteps.length-1 ? 'default' : 'pointer'}}
          onClick={() => {
            if (virtualStep === orderSteps.length-1) return;
            setVirtualAutoAdvance((v) => !v);
          }}
          disabled={virtualStep === orderSteps.length-1}
        >
          {virtualStep === orderSteps.length-1 ? 'Order Delivered' : (virtualAutoAdvance ? 'Pause Live Tracking' : 'Track Live')}
        </button>
        <div className="order-status-progress" style={{margin: '32px 0'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            {orderSteps.map((step, idx) => (
              <div key={idx} style={{textAlign: 'center', flex: 1}}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: idx <= virtualStep ? '#ffb347' : '#f3f3f3',
                  color: idx <= virtualStep ? '#fff' : '#8b1533',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  margin: '0 auto 6px auto',
                  border: idx === virtualStep ? '2px solid #8b1533' : '2px solid #f3f3f3',
                  transition: 'background 0.3s, border 0.3s'
                }}>{step.icon}</div>
                <div style={{fontSize: 12, color: idx <= virtualStep ? '#8b1533' : '#bbb', fontWeight: idx <= virtualStep ? 600 : 400}}>{step.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Moving Map Simulation */}
        <div className="svg-map-container" style={{margin:'32px 0'}}>
          <MovingMap orderStep={virtualStep} />
        </div>
        <div className="order-status-text" style={{marginTop:24}}>
          <p style={{fontWeight:600, color:'#8b1533'}}>{orderSteps[virtualStep].description}</p>
        </div>
        </>}
        <button className="btn" style={{marginTop: 24}} onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  // Real order: show loading, fetch order, and show progress
  useEffect(() => {
    setLoading(true);
    API.get(`/orders/${id}`)
      .then(res => {
        setOrder(res.data);
        const stepIndex = orderSteps.findIndex(step => step.status.toLowerCase() === res.data.status?.toLowerCase());
        setCurrentStep(stepIndex >= 0 ? stepIndex : 0);
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Animate progress for real orders if enabled and not delivered
  useEffect(() => {
    if (!order || order.status?.toLowerCase() === 'delivered' || !autoAdvance) return;
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < orderSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(intervalRef.current);
          return prev;
        }
      });
    }, 1500);
    return () => clearInterval(intervalRef.current);
  }, [autoAdvance, order]);

  if (loading) {
    return <div className="page container"><div style={{textAlign:'center',padding:'60px'}}>Loading order...</div></div>;
  }
  if (!order) {
    return <div className="page container"><div style={{textAlign:'center',padding:'60px'}}>Order not found.</div></div>;
  }

  return (
    <div className="order-status-container" style={{background:'#fdf6f8', borderRadius:16, padding:'32px 0 48px 0', boxShadow:'0 2px 16px #f3e6e9', maxWidth:1200, margin:'32px auto'}}>
      <h2 style={{fontWeight:800, fontSize:32, color:'#8b1533', marginBottom:8}}>Order Tracking</h2>
      <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:8, flexWrap:'wrap'}}>
        <span style={{fontSize:18}}>Order ID: <b>{order._id}</b></span>
        <span style={{
          background: currentStep === orderSteps.length-1 ? '#4caf50' : '#ffb347',
          color: currentStep === orderSteps.length-1 ? '#fff' : '#8b1533',
          borderRadius: 20,
          padding: '4px 18px',
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: 1,
          boxShadow: '0 1px 4px #f3e6e9',
          marginLeft: 8,
          transition: 'background 0.3s, color 0.3s'
        }}>{orderSteps[currentStep]?.label}</span>
      </div>
      <button
        className="btn"
        style={{marginBottom: 18, fontSize:15, fontWeight:700, boxShadow:'0 1px 4px #f3e6e9', background: currentStep === orderSteps.length-1 ? '#4caf50' : undefined, color: currentStep === orderSteps.length-1 ? '#fff' : undefined, cursor: currentStep === orderSteps.length-1 ? 'default' : 'pointer'}}
        onClick={() => {
          if (currentStep === orderSteps.length-1) return;
          if (!autoAdvance) setAutoAdvance(true);
          else setAutoAdvance(false);
        }}
        disabled={currentStep === orderSteps.length-1}
      >
        {currentStep === orderSteps.length-1 ? 'Order Delivered' : (autoAdvance ? 'Pause Live Tracking' : 'Track Live')}
      </button>
      <div className="order-status-progress" style={{margin: '40px 0 32px 0'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap:8}}>
          {orderSteps.map((step, idx) => (
            <div key={idx} style={{textAlign: 'center', flex: 1}}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: idx < currentStep ? '#ffb347' : idx === currentStep ? '#8b1533' : '#f3f3f3',
                color: idx < currentStep ? '#fff' : idx === currentStep ? '#fff' : '#8b1533',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                margin: '0 auto 8px auto',
                border: idx === currentStep ? '3px solid #ffb347' : '2px solid #f3f3f3',
                boxShadow: idx === currentStep ? '0 2px 12px #ffb34755' : 'none',
                transition: 'background 0.3s, border 0.3s, color 0.3s, box-shadow 0.3s'
              }}>{step.icon}</div>
              <div style={{fontSize: 14, color: idx <= currentStep ? '#8b1533' : '#bbb', fontWeight: idx <= currentStep ? 700 : 400, letterSpacing:0.5}}>{step.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Animated Map */}
      <div className="svg-map-container" style={{margin:'32px 0'}}>
        <MovingMap orderStep={currentStep} />
      </div>
      <div className="order-status-text" style={{marginTop:24}}>
  <p style={{fontWeight:700, color:'#8b1533', fontSize:20, letterSpacing:0.2, textShadow:'0 1px 2px #f3e6e9'}}>{orderSteps[currentStep]?.description || order.status}</p>
      </div>
      <button className="btn" style={{marginTop: 36, fontSize:16, fontWeight:700, boxShadow:'0 1px 4px #f3e6e9'}} onClick={() => navigate("/")}>Back to Home</button>
    </div>
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
// ...existing code...
// ...existing code...
