// client/src/pages/Landing.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../App.css";

export default function Landing() {
  const nav = useNavigate();

  const onShopNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // if not logged in, ask to login or register first
      nav("/login");
    } else {
      nav("/home");
    }
  };

  return (
    <main className="page" style={{ paddingTop: 48, paddingBottom: 48 }}>
      <div className="container" style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <h1 style={{ fontSize: 40, color: "#8b1533", marginBottom: 12 }}>Taste the Joy — Order Fresh Cakes</h1>
          <p style={{ color: "#6b6b6b", maxWidth: 560 }}>
            Handcrafted cakes from local bakeries delivered to your door. Customize as you like —
            message, color, or a special occasion note.
          </p>

          <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
            <button className="btn" onClick={onShopNow}>Shop Now</button>
            <button className="btn" style={{ background: "#ff6f8e" }} onClick={() => nav("/register")}>Sign Up</button>
          </div>

          <div style={{ marginTop: 22, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: 8, background: "#ff6f8e" }} />
              <div style={{ color: "#6b6b6b" }}>Fresh ingredients</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: 8, background: "#8b1533" }} />
              <div style={{ color: "#6b6b6b" }}>Custom messages</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: 8, background: "#fbb" }} />
              <div style={{ color: "#6b6b6b" }}>Fast delivery</div>
            </div>
          </div>
        </div>

        <div style={{ width: 420, minWidth: 260 }}>
          <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 14px 36px rgba(0,0,0,0.08)" }}>
            <img src="/images/cake1.jpg" alt="hero cake" style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 28, maxWidth: 1200, marginLeft: "auto", marginRight: "auto" }}>
        <h3 style={{ color: "#8b1533" }}>Popular categories</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
          <div className="card" style={{ width: 220, textAlign: "center" }}>
            <img src="/images/cake2.jpg" alt="cat" style={{ height: 120, width: "100%", objectFit: "cover", borderRadius: 8 }} />
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 700 }}>Birthday Cakes</div>
              <div style={{ color: "#6b6b6b", marginTop: 6, fontSize: 13 }}>Celebration favorites</div>
            </div>
          </div>

          <div className="card" style={{ width: 220, textAlign: "center" }}>
            <img src="/images/cake3.jpg" alt="cat" style={{ height: 120, width: "100%", objectFit: "cover", borderRadius: 8 }} />
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 700 }}>Premium Cakes</div>
              <div style={{ color: "#6b6b6b", marginTop: 6, fontSize: 13 }}>For special moments</div>
            </div>
          </div>

          <div className="card" style={{ width: 220, textAlign: "center" }}>
            <img src="/images/cake4.jpg" alt="cat" style={{ height: 120, width: "100%", objectFit: "cover", borderRadius: 8 }} />
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 700 }}>Custom Orders</div>
              <div style={{ color: "#6b6b6b", marginTop: 6, fontSize: 13 }}>Message & design</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
