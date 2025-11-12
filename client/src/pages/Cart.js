import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, setCart, fetchCart, loading } = useCart();
  const navigate = useNavigate();

  // Merge backend cart and virtual cart
  let virtualCart = [];
  try {
    virtualCart = JSON.parse(localStorage.getItem("virtualCart") || "[]");
  } catch {}

  const virtualCartItems = virtualCart.map(item => ({
    _id: item._id,
    product: item,
    quantity: item.quantity,
    price: item.price * item.quantity,
  }));

  const mergedCart = [...cart, ...virtualCartItems];

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const { data } = await API.put(`/cart/${itemId}`, { quantity: newQuantity });
      setCart(cart.map(item => 
        item._id === itemId ? { ...item, quantity: data.quantity, price: data.price } : item
      ));
      fetchCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
      alert("Failed to update quantity");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await API.delete(`/cart/${itemId}`);
      setCart(cart.filter(item => item._id !== itemId));
      fetchCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
      alert("Failed to remove item");
    }
  };

  // Direct order placement without payment modal
  const handlePlaceOrder = async () => {
    const hasReal = mergedCart.some(it => !it._id.startsWith('p'));
    const hasVirtual = mergedCart.some(it => it._id.startsWith('p'));

    if (!hasReal && !hasVirtual) {
      alert('Cart is empty. Please add products to cart.');
      return;
    }

    if (hasVirtual && !hasReal) {
      // Only virtual items
      localStorage.removeItem('virtualCart');
      setCart([]);
      fetchCart();
      const oid = `virtual_${Date.now()}`;
      navigate(`/order-status/${oid}`);
      return;
    }

    try {
      const res = await API.post("/orders");
      localStorage.removeItem('virtualCart');
      setCart([]);
      fetchCart();
      const oid = res.data?.order?._id || `real_${Date.now()}`;
      navigate(`/order-status/${oid}`);
    } catch (err) {
      console.error("Failed to place order:", err);
      const msg = err.response?.data?.message || err.message || "Failed to place order";
      alert("Failed to place order: " + msg);
    }
  };

  const totalAmount = mergedCart.reduce((sum, item) => sum + item.price, 0);

  if (loading) {
    return <div className="p-6">Loading cart...</div>;
  }

  return (
    <div className="page container">
      <h1 style={{color: '#8b1533', marginBottom: '24px'}}>Your Cart</h1>

      {mergedCart.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px'}}>
          <img src="/images/empty-cart.png" alt="Empty cart" style={{width: '200px', marginBottom: '16px'}} />
          <p style={{color: '#6b6b6b'}}>Your cart is empty</p>
          <button 
            onClick={() => navigate('/bakeries')}
            className="btn"
            style={{marginTop: '16px'}}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <div className="card-container">
            {mergedCart.map((item) => (
              <div key={item._id} className="card">
                {item.product ? (
                  <img 
                    src={item.product.image?.startsWith('/') ? item.product.image : `/images/${item.product.image}`} 
                    alt={item.product.name}
                    style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px'}}
                  />
                ) : (
                  <div style={{height: '200px', background: '#f8d7da', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#8b1533', fontWeight: 600}}>
                    Product unavailable
                  </div>
                )}
                <div className="card-body">
                  <h3 className="card-title">{item.product ? item.product.name : 'Unknown Product'}</h3>
                  <p style={{color: '#6b6b6b', marginBottom: '12px'}}>
                    {item.product ? `₹${item.product.price} each` : 'No price info'}
                  </p>
                  {item.customization && (
                    <p style={{fontSize: '14px', color: '#8b1533', marginBottom: '12px'}}>
                      Customization: {item.customization}
                    </p>
                  )}
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                    <label>Quantity:</label>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <button 
                        onClick={() => {
                          if (item._id.startsWith('p')) {
                            let vCart = JSON.parse(localStorage.getItem('virtualCart') || '[]');
                            vCart = vCart.map(it => it._id === item._id ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it);
                            localStorage.setItem('virtualCart', JSON.stringify(vCart));
                            window.location.reload();
                            return;
                          }
                          updateQuantity(item._id, item.quantity - 1);
                        }}
                        style={{
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          border: '1px solid #8b1533',
                          background: 'white',
                          color: '#8b1533',
                          cursor: 'pointer'
                        }}
                      >
                        -
                      </button>
                      <span style={{minWidth: '20px', textAlign: 'center'}}>{item.quantity}</span>
                      <button 
                        onClick={() => {
                          if (item._id.startsWith('p')) {
                            let vCart = JSON.parse(localStorage.getItem('virtualCart') || '[]');
                            vCart = vCart.map(it => it._id === item._id ? { ...it, quantity: it.quantity + 1 } : it);
                            localStorage.setItem('virtualCart', JSON.stringify(vCart));
                            window.location.reload();
                            return;
                          }
                          updateQuantity(item._id, item.quantity + 1);
                        }}
                        style={{
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          border: '1px solid #8b1533',
                          background: 'white',
                          color: '#8b1533',
                          cursor: 'pointer'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontWeight: 'bold', color: '#8b1533'}}>₹{item.price}</span>
                    <button 
                      onClick={() => {
                        if (item._id.startsWith('p')) {
                          let vCart = JSON.parse(localStorage.getItem('virtualCart') || '[]');
                          vCart = vCart.filter(it => it._id !== item._id);
                          localStorage.setItem('virtualCart', JSON.stringify(vCart));
                          window.location.reload();
                          return;
                        }
                        removeItem(item._id);
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid #ff4444',
                        color: '#ff4444',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '32px',
            padding: '20px',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #f1e6e9'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h3 style={{color: '#8b1533'}}>Total Amount</h3>
              <h3 style={{color: '#8b1533'}}>₹{totalAmount}</h3>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="btn"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
