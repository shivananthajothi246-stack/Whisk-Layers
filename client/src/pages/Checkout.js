import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Checkout(){
  const [address, setAddress] = useState("");
  const [items, setItems] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState("method"); // method | onlineType | confirm | form | loading | success | fail
  const [paymentMethod, setPaymentMethod] = useState(""); // 'cash' | 'online'
  const [onlineType, setOnlineType] = useState(""); // 'card' | 'upi'
  const nav = useNavigate();

  useEffect(()=> {
    API.get("/cart").then(r => {
      let backendItems = r.data.items || [];
      let virtualCart = [];
      try {
        virtualCart = JSON.parse(localStorage.getItem('virtualCart') || '[]');
      } catch {}
      // Convert virtual cart to same shape as backend items
      const virtualItems = virtualCart.map(item => ({
        _id: item._id,
        product: item,
        quantity: item.quantity,
        price: item.price * item.quantity,
        customization: item.customization || ''
      }));
      setItems([...backendItems, ...virtualItems]);
    }).catch(console.error);
  }, []);

  const total = items.reduce((s,it)=> s + ((it.product?.price || 0) * it.quantity), 0);


  // Simulate payment process
  const handleFakePayment = async (e) => {
    if (e) e.preventDefault();
    setPaymentStep("loading");
    setTimeout(async () => {
      // Simulate random success/failure (90% success)
      if (Math.random() < 0.9) {
        setPaymentStep("success");
        setTimeout(async () => {
          // Check if any items (real or virtual) exist
          const virtualCart = JSON.parse(localStorage.getItem('virtualCart') || '[]');
          const hasReal = items.some(it => !it._id.startsWith('p'));
          const hasVirtual = items.some(it => it._id.startsWith('p'));
          if (hasVirtual && !hasReal) {
            // Only virtual: simulate order
            localStorage.removeItem('virtualCart');
            nav(`/success?orderId=virtual_${Date.now()}`);
            return;
          }
          if (!hasReal && !hasVirtual) {
            setPaymentStep("fail");
            alert("Cart is empty. Please add products to cart.");
            return;
          }
          try {
            const res = await API.post("/orders", {
              address,
              paymentMethod: 'online',
              paymentStatus: 'Paid',
              onlineType
            });
            localStorage.removeItem('virtualCart');
            nav(`/success?orderId=${res.data.order._id}`);
          } catch (err) {
            setPaymentStep("fail");
          }
        }, 1200);
      } else {
        setPaymentStep("fail");
      }
    }, 1800);
  };

  // Simulate cash payment (just show status, no form)
  const handleCashPayment = async () => {
    setPaymentStep("loading");
    setTimeout(async () => {
      setPaymentStep("success");
      setTimeout(async () => {
        const virtualCart = JSON.parse(localStorage.getItem('virtualCart') || '[]');
        const hasReal = items.some(it => !it._id.startsWith('p'));
        const hasVirtual = items.some(it => it._id.startsWith('p'));
        if (hasVirtual && !hasReal) {
          localStorage.removeItem('virtualCart');
          nav(`/success?orderId=virtual_${Date.now()}`);
          return;
        }
        if (!hasReal && !hasVirtual) {
          setPaymentStep("fail");
          alert("Cart is empty. Please add products to cart.");
          return;
        }
        try {
          const res = await API.post("/orders", {
            address,
            paymentMethod: 'cash',
            paymentStatus: 'Pending'
          });
          localStorage.removeItem('virtualCart');
          nav(`/success?orderId=${res.data.order._id}`);
        } catch (err) {
          setPaymentStep("fail");
        }
      }, 1200);
    }, 1200);
  };

  return (
    <main className="page container">
      <h1>Checkout</h1>
      <div className="card" style={{maxWidth:900}}>
        <textarea className="form-input" placeholder="Delivery address" value={address} onChange={e=>setAddress(e.target.value)} />
        <h3>Order Summary</h3>
        {items.map(it=>(
          <div key={it._id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px dashed #eee'}}>
            <div>{it.product?.name} x {it.quantity}</div>
            <div>₹{it.product?.price * it.quantity}</div>
          </div>
        ))}
        <h3 style={{textAlign:'right'}}>Total: ₹{total}</h3>
        <div style={{textAlign:'right'}}>
          <button className="btn" onClick={()=>setShowPayment(true)}>Pay & Place Order</button>
        </div>
      </div>

      {/* Simulated Payment Modal */}
      {showPayment && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card" style={{minWidth:340, maxWidth:400, padding:32, textAlign:'center', position:'relative'}}>
            <button onClick={()=>{setShowPayment(false); setPaymentStep('method'); setPaymentMethod(''); setOnlineType('');}} style={{position:'absolute',top:12,right:16,background:'none',border:'none',fontSize:20,cursor:'pointer',color:'#8b1533'}}>×</button>
            {/* Step 1: Choose payment method */}
            {paymentStep === "method" && (
              <>
                <h2 style={{color:'#8b1533',marginBottom:16}}>Choose Payment Method</h2>
                <button className="btn" style={{width:'100%',marginBottom:12}} onClick={()=>{setPaymentMethod('cash'); setPaymentStep('confirm');}}>Cash on Delivery</button>
                <button className="btn" style={{width:'100%',background:'#ff6f8e'}} onClick={()=>{setPaymentMethod('online'); setPaymentStep('onlineType');}}>Pay Online</button>
              </>
            )}
            {/* Step 2: If online, choose type */}
            {paymentStep === "onlineType" && (
              <>
                <h2 style={{color:'#8b1533',marginBottom:16}}>Pay Online</h2>
                <button className="btn" style={{width:'100%',marginBottom:12}} onClick={()=>{setOnlineType('card'); setPaymentStep('confirm');}}>Credit/Debit Card</button>
                <button className="btn" style={{width:'100%',background:'#ff6f8e'}} onClick={()=>{setOnlineType('upi'); setPaymentStep('confirm');}}>UPI</button>
              </>
            )}
            {/* Step 3: Confirm payment */}
            {paymentStep === "confirm" && (
              <>
                <h2 style={{color:'#8b1533',marginBottom:16}}>Confirm Payment</h2>
                <div style={{marginBottom:16}}>
                  <strong>Method:</strong> {paymentMethod === 'cash' ? 'Cash on Delivery' : (onlineType === 'card' ? 'Card' : 'UPI')}
                </div>
                <div style={{marginBottom:16}}>
                  <strong>Amount:</strong> ₹{total}
                </div>
                <button className="btn" style={{width:'100%'}} onClick={()=>{
                  if(paymentMethod === 'cash') handleCashPayment();
                  else setPaymentStep('form');
                }}>Proceed to Pay</button>
              </>
            )}
            {/* Step 4: If online, show form for card/upi */}
            {paymentStep === "form" && (
              <form onSubmit={handleFakePayment}>
                <h2 style={{color:'#8b1533',marginBottom:16}}>{onlineType === 'card' ? 'Card Payment' : 'UPI Payment'}</h2>
                {onlineType === 'card' ? (
                  <>
                    <input required placeholder="Card Number" maxLength={16} style={{width:'100%',padding:10,marginBottom:12,borderRadius:8,border:'1px solid #eee'}} />
                    <div style={{display:'flex',gap:8,marginBottom:12}}>
                      <input required placeholder="MM/YY" maxLength={5} style={{flex:1,padding:10,borderRadius:8,border:'1px solid #eee'}} />
                      <input required placeholder="CVV" maxLength={3} style={{flex:1,padding:10,borderRadius:8,border:'1px solid #eee'}} />
                    </div>
                  </>
                ) : (
                  <input required placeholder="Enter UPI ID" style={{width:'100%',padding:10,marginBottom:12,borderRadius:8,border:'1px solid #eee'}} />
                )}
                <button className="btn" type="submit" style={{width:'100%',marginTop:8}}>Pay ₹{total}</button>
              </form>
            )}
            {/* Step 5: Loading */}
            {paymentStep === "loading" && (
              <div style={{padding:32}}>
                <div className="spinner" style={{margin:'24px auto',width:48,height:48,border:'5px solid #eee',borderTop:'5px solid #8b1533',borderRadius:'50%',animation:'spin 1s linear infinite'}} />
                <p style={{color:'#8b1533',marginTop:24}}>Processing payment...</p>
              </div>
            )}
            {/* Step 6: Success */}
            {paymentStep === "success" && (
              <div style={{padding:32}}>
                <img src="/images/success.png" alt="success" style={{width:64,marginBottom:16}} />
                <h3 style={{color:'#388e3c'}}>Payment Successful!</h3>
                <p style={{color:'#6b6b6b'}}>Placing your order...</p>
              </div>
            )}
            {/* Step 7: Fail */}
            {paymentStep === "fail" && (
              <div style={{padding:32}}>
                <div style={{fontSize:48,color:'#d32f2f',marginBottom:16}}>✖</div>
                <h3 style={{color:'#d32f2f'}}>Payment Failed</h3>
                <button className="btn" style={{marginTop:16}} onClick={()=>setPaymentStep("form")}>Try Again</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
