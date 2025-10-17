import { createContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  reload, updateEmail, reauthenticateWithCredential, EmailAuthProvider
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase"; // tu instancia de Firestore

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [authError, setAuthError] = useState(null);

  // 🔹 Detecta cambios de usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setIsLoadingUser(false);
    });

    return unsubscribe;
  }, []);
  //Funcionalidad para actualizar el correo electronico(modificar):
const changeEmailFirestore = async (userId, newEmail) => {
  try {
    if (!userId) throw new Error("No hay usuario logueado");

    const userRef = doc(db, "users", userId); // colección "users", doc con id = user.uid

    // 🔹 Opcional: obtener datos actuales
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("Usuario no encontrado en Firestore");

    // 🔹 Actualizar solo el campo email en Firestore
    await updateDoc(userRef, { email: newEmail });

    return { success: true, message: "Correo actualizado en Firestore correctamente" };
  } catch (error) {
    console.error("Error al cambiar correo en Firestore:", error);
    return { success: false, message: error.message };
  }
};


  // 🔹 Refresca automáticamente emailVerified mientras el usuario esté logueado
  useEffect(() => {
    let interval;
    if (user) {
      interval = setInterval(async () => {
        await reload(auth.currentUser);
        setUser({ ...auth.currentUser });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [user]);

  const register = async (email, password) => {
    try {
      setAuthError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const login = async (email, password) => {
    try {
      setAuthError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoadingUser, authError, register, login, logout, resetPassword,changeEmailFirestore }}
    >
      {children}
    </AuthContext.Provider>
  );
};
