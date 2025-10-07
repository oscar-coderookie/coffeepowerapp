import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  // 🟢 Detectar usuario logueado/deslogueado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // 🔹 Cargar carrito de Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().cart) {
          setCartItems(userSnap.data().cart);
        } else {
          await setDoc(userRef, { cart: [] }, { merge: true });
          setCartItems([]);
        }
      } else {
        setUser(null);

        // 🔹 Cargar carrito desde AsyncStorage (local) si no hay usuario
        const localCart = await AsyncStorage.getItem("cartItems");
        setCartItems(localCart ? JSON.parse(localCart) : []);
      }
    });

    return unsubscribe;
  }, []);

  // 🔹 Guardar carrito
  const saveCart = async (updatedCart) => {
    setCartItems(updatedCart);

    if (user) {
      // 🔹 Guardar en Firestore solo si hay usuario
      try {
        const simplifiedCart = updatedCart.map((item) => ({
          id: item.id,
          name: item.name || "Producto",
          image: item.image || null,
          quantity: item.quantity || 1,
        }));
        await updateDoc(doc(db, "users", user.uid), { cart: simplifiedCart });
      } catch (error) {
        console.error("❌ Error guardando carrito en Firestore:", error);
      }
    } else {
      // 🔹 Guardar en AsyncStorage para usuario invitado
      await AsyncStorage.setItem("cartItems", JSON.stringify(updatedCart));
    }
  };

  // 🔸 Funciones de carrito
  const addToCart = (coffee) => {
    if (!coffee || !coffee.id) return;

    const updatedCart = [...cartItems];
    const existing = updatedCart.find((item) => item.id === coffee.id);

    if (existing) {
      existing.quantity += coffee.quantity || 1;
    } else {
      updatedCart.push({
        id: coffee.id,
        name: coffee.name || "Producto",
        image: coffee.image || null,
        quantity: coffee.quantity || 1,
      });
    }

    saveCart(updatedCart);
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    saveCart(updatedCart);
  };

  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    saveCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cartItems
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // 🔸 Logout seguro
  const logout = async () => {
    try {
      if (user) {
        await signOut(auth); // 🔹 Desconectar de Firebase
      }
      setUser(null);
      setCartItems([]);
      await AsyncStorage.removeItem("cartItems"); // 🔹 Limpiar carrito local
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
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
        user,
        logout, // 🔹 Exportamos logout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
