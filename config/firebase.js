import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyApeSn8TG6eLyi8_vL7DkhnhstlrXSmaL4",
  authDomain: "mister-coffee-763ae.firebaseapp.com",
  projectId: "mister-coffee-763ae",
  storageBucket: "mister-coffee-763ae.firebasestorage.app",
  messagingSenderId: "509437818681",
  appId: "1:509437818681:web:c3dc65a762f6c254df5ae8",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);

// 🔹 Persistencia con AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
