// context/CartContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { db } from "../config/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);

  // Carga inicial del carrito
  useEffect(() => {
    const loadCart = async () => {
      setIsLoadingCart(true);
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().cart) {
          setCartItems(userSnap.data().cart);
        } else {
          await setDoc(userRef, { cart: [] }, { merge: true });
          setCartItems([]);
        }
      } else {
        const localCart = await AsyncStorage.getItem("cartItems");
        setCartItems(localCart ? JSON.parse(localCart) : []);
      }
      setIsLoadingCart(false);
    };

    loadCart();
  }, [user]);

  // Guarda el carrito (Firestore o AsyncStorage)
  const saveCart = async (updatedCart) => {
    setCartItems(updatedCart);

    if (user) {
      try {
        const simplifiedCart = updatedCart.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price ?? 0,
          description: item.description ?? "",
        }));
        await updateDoc(doc(db, "users", user.uid), { cart: simplifiedCart });
    
      } catch (error) {
        console.error("Error guardando carrito en Firestore:", error)
      }
    } else {
      await AsyncStorage.setItem("cartItems", JSON.stringify(updatedCart));
    }
  };

  // Añadir item al carrito
  const addToCart = (item) => {
    const existing = cartItems.find((i) => i.id === item.id);
    let updatedCart;
    if (existing) {
      // Si ya existe, suma la cantidad que envíes
      updatedCart = cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
      );
    } else {
      // Si no existe, agrega el item con su cantidad actual
      updatedCart = [...cartItems, { ...item }];
    }
    saveCart(updatedCart);
  };

  // Eliminar item del carrito
  const removeFromCart = (id) => {
    const updated = cartItems.filter((i) => i.id !== id);
    saveCart(updated);
  };

  // Aumentar cantidad
  const increaseQuantity = (id) => {
    const updated = cartItems.map((i) =>
      i.id === id ? { ...i, quantity: i.quantity + 1 } : i
    );
    saveCart(updated);
  };

  // Disminuir cantidad
  const decreaseQuantity = (id) => {
    const updated = cartItems.map((i) =>
      i.id === id
        ? { ...i, quantity: i.quantity > 1 ? i.quantity - 1 : 1 }
        : i
    );
    saveCart(updated);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        isLoadingCart,
        user,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
