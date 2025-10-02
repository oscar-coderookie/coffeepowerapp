// context/CartContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 🔹 Cargar carrito al iniciar la app
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem("cart");
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
      }
    };

    loadCart();
  }, []);

  // 🔹 Guardar carrito cada vez que cambie
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem("cart", JSON.stringify(cartItems));
      } catch (error) {
        console.error("Error al guardar el carrito:", error);
      }
    };

    if (cartItems.length >= 0) {
      saveCart();
    }
  }, [cartItems]);

  const addToCart = (coffee) => {
    if (!coffee || !coffee.id) return;

    setCartItems((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === coffee.id);

      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: (updatedCart[existingIndex].quantity || 0) + (coffee.quantity || 1),
        };
        return updatedCart;
      } else {
        return [...prevCart, { ...coffee, quantity: coffee.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const increaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
