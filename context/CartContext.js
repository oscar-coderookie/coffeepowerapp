import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  // 🟢 Detectar usuario logueado/deslogueado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
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
        setCartItems([]);
      }
    });

    return unsubscribe;
  }, []);

  // 🔹 Guardar carrito limpio en Firestore
  const saveCartToFirestore = async (updatedCart) => {
    if (!user) return;
    try {
      const simplifiedCart = updatedCart.map((item) => ({
        id: item.id,
        name: item.name || "Producto",
        image: item.image || null,
        quantity: item.quantity || 1,
      }));

      await updateDoc(doc(db, "users", user.uid), { cart: simplifiedCart });
      console.log("🟢 Carrito guardado:", simplifiedCart);
    } catch (error) {
      console.error("❌ Error guardando carrito:", error);
    }
  };

  // 🔸 Añadir producto
  const addToCart = (coffee) => {
    if (!user) return console.log("⚠️ Debes iniciar sesión para agregar productos.");
    if (!coffee || !coffee.id) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === coffee.id);
      let updatedCart;

      if (existing) {
        updatedCart = prev.map((item) =>
          item.id === coffee.id
            ? { ...item, quantity: item.quantity + (coffee.quantity || 1) }
            : item
        );
      } else {
        updatedCart = [
          ...prev,
          {
            id: coffee.id,
            name: coffee.name || "Producto",
            image: coffee.image || null,
            quantity: coffee.quantity || 1,
          },
        ];
      }

      saveCartToFirestore(updatedCart);
      return updatedCart;
    });
  };

  // 🔸 Eliminar producto
  const removeFromCart = (id) => {
    if (!user) return;
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveCartToFirestore(updated);
      return updated;
    });
  };

  // 🔸 Aumentar cantidad
  const increaseQuantity = (id) => {
    if (!user) return;
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCartToFirestore(updated);
      return updated;
    });
  };

  // 🔸 Disminuir cantidad (y eliminar si llega a 0)
  const decreaseQuantity = (id) => {
    if (!user) return;
    setCartItems((prev) => {
      const updated = prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);

      saveCartToFirestore(updated);
      return updated;
    });
  };

  // 🔸 Vaciar carrito
  const clearCart = () => {
    if (!user) return;
    setCartItems([]);
    saveCartToFirestore([]);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
