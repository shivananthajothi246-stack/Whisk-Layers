import React from "react";
import { Link } from "react-router-dom";
export default function BottomNav(){
  return (
    <div className="bottom-nav">
      <Link to="/home">Home</Link>
      <Link to="/bakeries">Bakeries</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/profile">Profile</Link>
    </div>
  );
}
