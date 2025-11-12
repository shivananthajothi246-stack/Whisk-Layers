import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const { data } = await API.get("/cart");
      setCart(Array.isArray(data) ? data : (data.items || []));
    } catch (err) {
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // Listen for storage changes (e.g., another tab adds to cart)
    window.addEventListener("storage", fetchCart);
    return () => window.removeEventListener("storage", fetchCart);
  }, []);

  return (
    <CartContext.Provider value={{ cart, setCart, fetchCart, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
