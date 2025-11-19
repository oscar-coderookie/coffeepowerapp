import { createContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  reload, updateEmail, reauthenticateWithCredential, EmailAuthProvider, verifyBeforeUpdateEmail, deleteUser
} from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase"; // tu instancia de Firestore
import Toast from "react-native-toast-message";

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

  const changeEmail = async (newEmail, currentPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No hay usuario logueado");

      // 🔹 1. Crear credenciales con email actual y contraseña ingresada por el usuario
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      // 🔹 2. Reautenticación
      await reauthenticateWithCredential(user, credential);

      // 🔹 3. Enviar correo de verificación antes de actualizar el email
      await verifyBeforeUpdateEmail(user, newEmail);

      return {
        success: true,
        message: "Se envió un correo de verificación a la nueva dirección. Confirma tu email para completar el cambio."
      };

    } catch (error) {
      console.error("Error al cambiar correo:", error);

      if (error.code === "auth/requires-recent-login") {
        return { success: false, message: "Debes iniciar sesión de nuevo para cambiar tu correo." };
      } else if (error.code === "auth/email-already-in-use") {
        return { success: false, message: "Este correo ya está en uso." };
      } else {
        return { success: false, message: error.message };
      }
    }
  };
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

  //Registro:
const register = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      verified: false,
      isAdmin: false,
      avatar: "",
      phone: { codigo: "34", numero: "" },
      createdAt: serverTimestamp(),
    });

    return user;

  } catch (error) {
    console.log("Error registro:", error);
    throw error; // ✔️ importantísimo
  }
};


  //Login:
  const login = async (email, password) => {
    try {
      setAuthError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      setAuthError(error.message);
    }
  };
  //Logout:
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };
  //Resetear password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  //Borrar cuenta y datos de firestore:
const handleDeleteAccount = async (password) => {
  const currentUser = auth.currentUser;

  if (!password) {
    return Toast.show({
      type: "error",
      text1: "Error",
      text2: "Ingresa tu contraseña para confirmar.",
    });
  }

  if (!currentUser) {
    return Toast.show({
      type: "error",
      text1: "Error",
      text2: "No hay usuario autenticado.",
    });
  }

  try {
    // 1️⃣ Reautenticar
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      password
    );
    await reauthenticateWithCredential(currentUser, credential);

    // 2️⃣ Eliminar usuario de Firebase Auth
    await deleteUser(currentUser);

    // 💡 Aquí NO eliminas nada más.
    // La Cloud Function deleteAccount se encargará del resto.

    Toast.show({
      type: "success",
      text1: "Cuenta eliminada",
      text2: "Tu cuenta y todos tus datos han sido eliminados.",
    });

  } catch (error) {
    console.error("❌ Error eliminando cuenta:", error);

    if (error.code === "auth/wrong-password") {
      return Toast.show({
        type: "error",
        text1: "Contraseña incorrecta",
        text2: "La contraseña ingresada no es válida.",
      });
    }

    if (error.code === "auth/requires-recent-login") {
      return Toast.show({
        type: "error",
        text1: "Inicio de sesión requerido",
        text2: "Vuelve a iniciar sesión antes de eliminar tu cuenta.",
      });
    }

    Toast.show({
      type: "error",
      text1: "Error",
      text2: error.message,
    });
  }
};



  return (
    <AuthContext.Provider
      value={{ user, isLoadingUser, authError, register, login, logout, resetPassword, changeEmailFirestore, changeEmail, handleDeleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
};
