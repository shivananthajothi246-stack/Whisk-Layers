import React from "react";
import { useNavigate } from "react-router-dom";

export default function Profile(){
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const nav = useNavigate();
  
  return (
    <main className="page container">
      <h1>Profile</h1>
      <div className="card" style={{display:'flex',gap:16,alignItems:'center', marginBottom: '20px'}}>
        <img src="/images/profile.png" alt="profile" style={{width:96,height:96,borderRadius:12}} />
        <div style={{flex: 1}}>
          <div style={{fontWeight:700, fontSize: '20px', marginBottom: '4px'}}>{user.name || "Your name"}</div>
          <div style={{color: '#6b6b6b', marginBottom: '4px'}}>{user.email || "email@example.com"}</div>
          {user.phone && <div style={{color: '#6b6b6b'}}>{user.phone}</div>}
          {user.role && (
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
      <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
        <button 
          className="btn" 
          onClick={() => nav('/dashboard')}
          style={{flex: 1, minWidth: '200px'}}
        >
          📊 Go to Dashboard
        </button>
        <button 
          className="btn" 
          onClick={() => nav('/orders')}
          style={{flex: 1, minWidth: '200px', background: 'transparent', border: '2px solid #8b1533', color: '#8b1533'}}
        >
          📦 My Orders
        </button>
      </div>
    </main>
  );
}
