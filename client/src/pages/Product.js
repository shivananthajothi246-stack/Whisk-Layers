import React, { useState, useEffect } from "react";
import API from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const { fetchCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        // Fallback product data
        setProduct({
          id:"id",
          name: "Delicious Cake",
          description: "A wonderful handcrafted cake",
          price: 1200,
          image: "/images/cake1.jpg",
          customizable: true
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Place order directly (with payment modal in OrderStatus)
  const placeOrder = async () => {
    setAddingToCart(true);
    // Fallback/sample product: simulate order and redirect to virtual order status
    if (!product || !product._id) {
      setTimeout(() => {
        setAddingToCart(false);
        navigate(`/order-status/virtual_${id || 'sample'}`);
      }, 800);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to place an order!");
        navigate("/login");
        return;
      }
      // 1. Add to cart
      const cartData = {
        productId: product._id,
        quantity,
        customization,
      };
      await API.post("/cart/add", cartData);
      // 2. Place order
      const orderData = {
        productId: product._id,
        quantity,
        customization,
      };
      const response = await API.post("/orders", orderData);
      // 3. Redirect to order status page
      navigate(`/order-status/${response.data._id}`);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Please login to place an order!");
        navigate("/login");
      } else if (err.response?.status === 404) {
        alert("Product not found. Please try again.");
      } else {
        alert(`Error placing order: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const totalPrice = product ? product.price * quantity : 0;

  if (loading) {
    return (
      <div className="page container">
        <div style={{textAlign: 'center', padding: '40px'}}>
          <div style={{fontSize: '18px', color: '#8b1533'}}>Loading product...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      {product && (
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Product Image */}
          <div>
            <img 
              src={product.image?.startsWith('/') ? product.image : `/images/${product.image}`} 
              alt={product.name}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }}
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 style={{fontSize: '28px', color: '#8b1533', marginBottom: '12px'}}>
              {product.name}
            </h1>
            
            {product.description && (
              <p style={{color: '#6b6b6b', marginBottom: '20px', lineHeight: '1.6'}}>
                {product.description}
              </p>
            )}

            <div style={{
              background: '#fff0f2',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid #f1e6e9'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                <span style={{fontSize: '18px', color: '#6b6b6b'}}>Price per piece:</span>
                <span style={{fontSize: '24px', fontWeight: 'bold', color: '#8b1533'}}>₹{product.price}</span>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontSize: '18px', color: '#6b6b6b'}}>Total ({quantity} {quantity === 1 ? 'piece' : 'pieces'}):</span>
                <span style={{fontSize: '28px', fontWeight: 'bold', color: '#8b1533'}}>₹{totalPrice}</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{marginBottom: '24px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#8b1533'}}>
                Quantity:
              </label>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '2px solid #8b1533',
                    background: 'white',
                    color: '#8b1533',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  style={{
                    width: '80px',
                    height: '40px',
                    border: '2px solid #f1e6e9',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '2px solid #8b1533',
                    background: 'white',
                    color: '#8b1533',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Customization */}
            {product.customizable && (
              <div style={{marginBottom: '24px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#8b1533'}}>
                  Customization (Optional):
                </label>
                <textarea
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                  placeholder="Any special requests or customizations..."
                  style={{
                    width: '100%',
                    height: '100px',
                    border: '2px solid #f1e6e9',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '14px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            )}

            {/* Add to Cart Button */}

            <button
              onClick={async () => {
                setAddingToCart(true);
                // Fallback/sample product: add to virtual cart in localStorage
                if (!product || !product._id || product._id.startsWith('p')) {
                  const virtualCart = JSON.parse(localStorage.getItem('virtualCart') || '[]');
                  const existing = virtualCart.find(item => item._id === product._id);
                  if (existing) {
                    existing.quantity += 1;
                  } else {
                    virtualCart.push({ ...product, quantity: 1 });
                  }
                  localStorage.setItem('virtualCart', JSON.stringify(virtualCart));
                  setAddingToCart(false);
                  window.location = `/cart?added=${Date.now()}`;
                  return;
                }
                // Real product: add to backend cart
                const token = localStorage.getItem("token");
                if (!token) {
                  alert("Please login to add items to cart!");
                  setAddingToCart(false);
                  window.location = "/login";
                  return;
                }
                try {
                  const requestData = {
                    productId: product._id,
                    quantity,
                    customization,
                  };
                  await API.post("/cart/add", requestData);
                  setAddingToCart(false);
                  window.location = `/cart?added=${Date.now()}`;
                } catch (err) {
                  setAddingToCart(false);
                  alert("Error adding to cart: " + (err.response?.data?.message || err.message));
                }
              }}
              disabled={addingToCart}
              className="btn"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '18px',
                fontWeight: 'bold',
                background: addingToCart ? '#ccc' : '#8b1533',
                cursor: addingToCart ? 'not-allowed' : 'pointer'
              }}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            {(!product || !product._id) && (
              <div style={{color:'#8b1533',marginTop:12,fontWeight:600}}>
                This is a sample product. Please browse real bakeries for available products.
              </div>
            )}

            <div style={{marginTop: '16px', textAlign: 'center'}}>
              <button
                onClick={() => navigate('/bakeries')}
                style={{
                  background: 'transparent',
                  border: '2px solid #8b1533',
                  color: '#8b1533',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                ← Back to Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
