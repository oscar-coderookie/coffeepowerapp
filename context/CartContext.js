// context/CartContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { db } from "../config/firebase";

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);

  // ------------------------------------------
  // 🔥 Cargar carrito (Firestore o local)
  // ------------------------------------------
  useEffect(() => {
    let unsubscribe = null;
    setIsLoadingCart(true);

    const loadCart = async () => {
      if (user) {
        const cartRef = collection(db, "users", user.uid, "cart");

        unsubscribe = onSnapshot(cartRef, (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCartItems(items);
          setIsLoadingCart(false);
        });
      } else {
        const localCart = await AsyncStorage.getItem("cartItems");
        setCartItems(localCart ? JSON.parse(localCart) : []);
        setIsLoadingCart(false);
      }
    };

    loadCart();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // ------------------------------------------
  // 🔥 Carrito LOCAL (solo sin login)
  // ------------------------------------------
  const saveLocalCart = async (items) => {
    setCartItems(items);
    await AsyncStorage.setItem("cartItems", JSON.stringify(items));
  };

  // ------------------------------------------
  // 🔥 Añadir producto al carrito
  // ------------------------------------------
  const addToCart = async (item) => {
    const { id, name, price, image, quantity, description } = item;

    if (!user) {
      throw new Error("Debes iniciar sesión para añadir productos al carrito.");
    }

    const cartRef = doc(db, "users", user.uid, "cart", id);

    try {
      const snap = await getDoc(cartRef);

      if (snap.exists()) {
        // Ya existe: solo aumentar
        const existing = snap.data();
        await updateDoc(cartRef, {
          quantity: existing.quantity + quantity,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Nuevo item en carrito
        await setDoc(cartRef, {
          id,
          name,
          price,
          image: image || null,
          quantity: quantity ?? 1,
          description,
          addedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error añadiendo al carrito:", error);
      throw new Error("No se pudo añadir al carrito.");
    }
  };

  // ------------------------------------------
  // 🔥 Eliminar ítem
  // ------------------------------------------
  const removeFromCart = async (id) => {
    if (!user) {
      const updated = cartItems.filter((i) => i.id !== id);
      return saveLocalCart(updated);
    }

    const ref = doc(db, "users", user.uid, "cart", id);
    await deleteDoc(ref);
  };

  // ------------------------------------------
  // 🔥 Aumentar cantidad
  // ------------------------------------------
  const increaseQuantity = async (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    if (!user) {
      const updated = cartItems.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      );
      return saveLocalCart(updated);
    }

    const ref = doc(db, "users", user.uid, "cart", id);
    await updateDoc(ref, { quantity: item.quantity + 1 });
  };

  // ------------------------------------------
  // 🔥 Disminuir cantidad
  // ------------------------------------------
  const decreaseQuantity = async (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    if (!user) {
      const updated = cartItems.map((i) =>
        i.id === id
          ? { ...i, quantity: Math.max(1, i.quantity - 1) }
          : i
      );
      return saveLocalCart(updated);
    }

    const newQty = Math.max(1, item.quantity - 1);
    const ref = doc(db, "users", user.uid, "cart", id);
    await updateDoc(ref, { quantity: newQty });
  };

  const clearCart = async (uid) => {
    const cartRef = collection(db, `users/${uid}/cart`);
    const snapshot = await getDocs(cartRef);

    const deletes = snapshot.docs.map((d) =>
      deleteDoc(doc(db, `users/${uid}/cart/${d.id}`))
    );

    await Promise.all(deletes);

    // También vacía el estado local
    setCartItems([]);
  };

  // ------------------------------------------
  // PROVIDER
  // ------------------------------------------
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        isLoadingCart,
        clearCart,
        user,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
