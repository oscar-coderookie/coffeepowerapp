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

  useEffect(() => {
    const loadCart = async () => {
      setIsLoadingCart(true);

      if (user) {
        // 🔹 Usuario logueado → cargar Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().cart) {
          setCartItems(userSnap.data().cart);
        } else {
          await setDoc(userRef, { cart: [] }, { merge: true });
          setCartItems([]);
        }
      } else {
        // 🔹 Invitado → cargar carrito local
        const localCart = await AsyncStorage.getItem("cartItems");
        setCartItems(localCart ? JSON.parse(localCart) : []);
      }

      setIsLoadingCart(false);
    };

    loadCart();
  }, [user]); // 🔥 Se actualiza cuando el usuario cambia

  const saveCart = async (updatedCart) => {
    setCartItems(updatedCart);

    if (user) {
      const simplifiedCart = updatedCart.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
      }));
      await updateDoc(doc(db, "users", user.uid), { cart: simplifiedCart });
    } else {
      await AsyncStorage.setItem("cartItems", JSON.stringify(updatedCart));
    }
  };

  const addToCart = (item) => {
    const existing = cartItems.find((i) => i.id === item.id);
    let updatedCart;
    if (existing) {
      updatedCart = cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedCart = [...cartItems, { ...item, quantity: 1 }];
    }
    saveCart(updatedCart);
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter((i) => i.id !== id);
    saveCart(updated);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, isLoadingCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
