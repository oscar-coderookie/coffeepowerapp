import React, { createContext, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../config/firebase";
import Toast from "react-native-toast-message";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // 🔹 Detectar usuario logueado
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribeAuth();
  }, []);

  // 🔹 Escuchar favoritos desde la SUBCOLECCIÓN
  useEffect(() => {
    if (!user || isDeletingAccount) {
      setFavorites([]);
      return;
    }

    const ref = collection(db, `users/${user.uid}/favorites`);

    const unsubscribe = onSnapshot(ref, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setFavorites(list);
    });

    return () => unsubscribe();
  }, [user, isDeletingAccount]);

  // ⭐ Agregar o quitar favorito
  const toggleFavorite = async (cafe) => {
    const userId = auth.currentUser.uid;
    const ref = doc(db, "users", userId, "favorites", cafe.id);

    const exists = await getDoc(ref);

    if (exists.exists()) {
      await deleteDoc(ref);
      return { added: false };
    }

    await setDoc(ref, {
      id: cafe.id,
      description: cafe.description,
      name: cafe.name,
      image: cafe.image,
      price: cafe.price,
      createdAt: Date.now(),
    });

    return { added: true };
  };

  const deleteFavorite = async (id , name) => {
    const userId = auth.currentUser.uid;
    const ref = doc(db, "users", userId, "favorites", id);

    try {
      await deleteDoc(ref);
      Toast.show({ type: "error", text1: `${name}: Eliminado de Favoritos` });
    } catch (error) {
      console.error("Error eliminando favorito:", error);
    }
  };
  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        user,
        setIsDeletingAccount,
        deleteFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
