import React, { useEffect, useState } from "react";
import API from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Customization(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const { fetchCart } = useCart();

  useEffect(()=> {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/products/${id}`);
        if (res.data) {
          setProduct(res.data);
        } else {
          setError("Product not found");
        }
      } catch (err) { 
        console.error(err);
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const add = async () => {
    const token = localStorage.getItem("token");
    if (!token) { 
      alert("Please login to add items to cart");
      nav("/login"); 
      return; 
    }
    if (!product || !product._id) {
      alert("Product information is missing");
      return;
    }
    setAdding(true);
    try {
      await API.post("/cart/add", { 
        productId: product._id || id, 
        quantity: qty, 
        customization: note 
      });
      await fetchCart();
      alert("Added to cart successfully!");
      nav("/cart");
    } catch (err) { 
      console.error(err);
      alert(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="page container">
      <div style={{padding:40, textAlign:'center'}}>
        <div style={{fontSize:18, color:'#8b1533'}}>Loading product...</div>
      </div>
    </div>
  );

  if (error || !product) return (
    <div className="page container">
      <div style={{padding:40, textAlign:'center'}}>
        <div style={{fontSize:18, color:'#d32f2f', marginBottom:20}}>{error || "Product not found"}</div>
        <button className="btn" onClick={() => nav("/bakeries")}>Back to Bakeries</button>
      </div>
    </div>
  );

  return (
    <main className="page container">
      <div style={{maxWidth:740,margin:'0 auto'}} className="card">
        <h2>Customize - {product.name}</h2>
        <img src={product.image.startsWith('/')?product.image:`/images/${product.image}`} alt={product.name} style={{width:320,borderRadius:12}} />
        <textarea className="form-input" placeholder="Customization/Message" value={note} onChange={e=>setNote(e.target.value)} />
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <label>Qty</label>
          <input type="number" min="1" value={qty} onChange={e=>setQty(Number(e.target.value))} style={{width:80}} />
          <button 
            className="btn" 
            onClick={add}
            disabled={adding}
            style={{opacity: adding ? 0.6 : 1, cursor: adding ? 'not-allowed' : 'pointer'}}
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </main>
  );
}
