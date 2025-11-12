import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";


export default function Navbar(){
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { cart } = useCart();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="navbar" style={{padding:0}}>
      <div style={{display:'flex',alignItems:'center',width:'100%'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginLeft:0}}>
          <Link to="/home">
            <img src="/images/logo.png" alt="logo" style={{width:48,height:48,borderRadius:8,marginLeft:16}} />
          </Link>
          <div>
            <div style={{fontWeight:700,color:'#8b1533'}}>Whisk Layers</div>
            <div style={{fontSize:12,color:'#6b6b6b'}}>Delicious Bakes</div>
          </div>
        </div>
  <nav style={{display:'flex',gap:18,alignItems:'center',fontWeight:600,marginLeft:'auto',marginRight:16}}>
          <Link to="/home">Home</Link>
          <Link to="/bakeries">Bakeries</Link>
          <Link to="/cart" style={{position:'relative'}}>
            Cart
            {cart && cart.length > 0 && (
              <span style={{
                position: 'absolute',
                top: -8,
                right: -18,
                background: '#8b1533',
                color: '#fff',
                borderRadius: '50%',
                fontSize: 12,
                minWidth: 20,
                height: 20,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                padding: '0 6px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
              }}>{cart.length}</span>
            )}
          </Link>
          {token && <Link to="/dashboard">Dashboard</Link>}
          <Link to="/profile">Profile</Link>
          {token && user?.role === 'admin' && <Link to="/admin-dashboard" style={{color:'#8b1533',background:'#fff0f2',padding:'6px 10px',borderRadius:8}}>📊 Admin</Link>}
          {!token ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" style={{color:'#8b1533',background:'#fff0f2',padding:'6px 10px',borderRadius:8}}>Sign Up</Link>
            </>
          ) : (
            <>
              <span style={{color:'#6b6b6b'}}>{user.name}</span>
              <button onClick={logout} style={{background:'transparent',border:'none',cursor:'pointer',color:'#8b1533',fontWeight:700}}>Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
