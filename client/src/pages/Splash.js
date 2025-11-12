// client/src/pages/Splash.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../App.css";

export default function Splash() {
  const nav = useNavigate();

  useEffect(() => {
    // Automatically go to Landing after 1400ms (short splash)
    const t = setTimeout(() => {
      nav("/landing");
    }, 1400);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        flexDirection: "column",
        padding: 24
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <img
          src="/images/logo.png"
          alt="Whisk Layers"
          style={{
            width: 72,
            height: 72,
            objectFit: "cover",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
          }}
        />
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#8b1533" }}>Whisk Layers</div>
          <div style={{ fontSize: 12, color: "#6b6b6b" }}>Delicious Bakes</div>
        </div>
      </div>

      <div style={{ marginTop: 22, color: "#6b6b6b" }}>
        <small>Loading, please wait…</small>
      </div>

      <div style={{ marginTop: 18 }}>
        <button
          className="btn"
          onClick={() => nav("/landing")}
          style={{ padding: "8px 12px", borderRadius: 10 }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
