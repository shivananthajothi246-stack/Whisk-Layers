import React, { useEffect, useState } from "react";
import API from "../api";
import { useParams, useNavigate } from "react-router-dom";

export default function Customization(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);
  const nav = useNavigate();

  useEffect(()=> {
    const load = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        if (res.data) setProduct(res.data);
      } catch (err) { console.error(err); }
    };
    load();
  }, [id]);

  const add = async () => {
    const token = localStorage.getItem("token");
    if (!token) { nav("/login"); return; }
    try {
      await API.post("/cart/add", { productId: id, quantity: qty, customization: note });
      nav("/cart");
    } catch (err) { console.error(err); alert("Failed"); }
  };

  if (!product) return <div style={{padding:40}}>Loading...</div>;

  return (
    <main className="page container">
      <div style={{maxWidth:740,margin:'0 auto'}} className="card">
        <h2>Customize - {product.name}</h2>
        <img src={product.image.startsWith('/')?product.image:`/images/${product.image}`} alt={product.name} style={{width:320,borderRadius:12}} />
        <textarea className="form-input" placeholder="Customization/Message" value={note} onChange={e=>setNote(e.target.value)} />
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <label>Qty</label>
          <input type="number" min="1" value={qty} onChange={e=>setQty(Number(e.target.value))} style={{width:80}} />
          <button className="btn" onClick={add}>Add to Cart</button>
        </div>
      </div>
    </main>
  );
}
