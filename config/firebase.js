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
  apiKey: "AIzaSyDOWCEccLTfLq32bg-HY9Pmy6aj-0XU64o",
  authDomain: "chris-rosas-web.firebaseapp.com",
  projectId: "chris-rosas-web",
  storageBucket: "chris-rosas-web.appspot.com",
  messagingSenderId: "528871640613",
  appId: "1:528871640613:web:8337bcab91d9bf4ffb39cc"
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
