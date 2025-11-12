import React from "react";
export default function Profile(){
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <main className="page container">
      <h1>Profile</h1>
      <div className="card" style={{display:'flex',gap:16,alignItems:'center'}}>
        <img src="/images/profile.png" alt="profile" style={{width:96,height:96,borderRadius:12}} />
        <div>
          <div style={{fontWeight:700}}>{user.name || "Your name"}</div>
          <div>{user.email || "email@example.com"}</div>
        </div>
      </div>
    </main>
  );
}
