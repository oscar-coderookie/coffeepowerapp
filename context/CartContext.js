import React, { createContext, useState } from "react";

// Creamos el contexto
export const CartContext = createContext();

// Provider para envolver toda la app
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // función para agregar producto
  const addToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  // función para eliminar producto
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // limpiar carrito
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
