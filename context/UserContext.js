// context/UserContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { doc, collection, onSnapshot } from "firebase/firestore";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    let unsubscribeUser = () => {};
    let unsubscribeAddresses = () => {};

    const unsubscribeAuth = auth.onAuthStateChanged((firebaseUser) => {
      // 🔹 Limpiamos cualquier listener previo
      unsubscribeUser();
      unsubscribeAddresses();

      if (!firebaseUser) {
        setUserData(null);
        setAddresses([]);
        setLoadingUser(false);
        return;
      }

      const userRef = doc(db, "users", firebaseUser.uid);

      // 🔹 Listener en tiempo real del documento de usuario
      unsubscribeUser = onSnapshot(
        userRef,
        (snap) => {
          if (!snap.exists()) {
            setUserData({ uid: firebaseUser.uid, email: firebaseUser.email ?? "" });
          } else {
            setUserData({ uid: firebaseUser.uid, email: firebaseUser.email ?? "", ...snap.data() });
          }
          setLoadingUser(false);

          // 🔹 Listener en tiempo real de direcciones solo después de tener userData
          const addressesRef = collection(db, `users/${firebaseUser.uid}/addresses`);
          unsubscribeAddresses = onSnapshot(addressesRef, (snapshot) => {
            setAddresses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          });
        },
        (err) => {
          console.error("❌ Error en snapshot de usuario:", err);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUser();
      unsubscribeAddresses();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        userData,
        addresses,
        loadingUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
