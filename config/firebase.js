// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔹 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyApeSn8TG6eLyi8_vL7DkhnhstlrXSmaL4",
  authDomain: "mister-coffee-763ae.firebaseapp.com",
  projectId: "mister-coffee-763ae",
  storageBucket: "aroma-king-web.appspot.com", // ✅ tu bucket correcto
  messagingSenderId: "509437818681",
  appId: "1:509437818681:web:c3dc65a762f6c254df5ae8",
};

// 🔹 Inicializar Firebase App (solo una vez)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 🔹 Firestore
export const db = getFirestore(app);

// 🔹 Storage
export const storage = getStorage(app);

// 🔹 Auth (evitar "already-initialized")
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
