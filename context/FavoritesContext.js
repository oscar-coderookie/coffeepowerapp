import React, { createContext, useEffect, useState } from "react";
import { onSnapshot, doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../config/firebase";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // 🔹 Detectar el usuario actual de Firebase Auth
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribeAuth();
  }, []);

  // 🔹 Escuchar en tiempo real los favoritos del usuario
  useEffect(() => {
    if (!user || isDeletingAccount) {
      setFavorites([]); // limpiar al cerrar sesión o al eliminar cuenta
      return;
    }

    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setFavorites(data.favorites || []);
      } 
      // ❌ ya no crear el documento si no existe
    });

    return () => unsubscribe();
  }, [user, isDeletingAccount]);

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites, user, setIsDeletingAccount }}>
      {children}
    </FavoritesContext.Provider>
  );
};
