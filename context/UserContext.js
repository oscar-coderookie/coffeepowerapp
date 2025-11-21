// context/UserContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);      // datos del documento Firestore
  const [addresses, setAddresses] = useState([]);      // subcolección
  const [loadingUser, setLoadingUser] = useState(true); // loading global

  const fetchAddresses = async (uid = userData.uid) => {
    if (!uid) return;
    try {
      const snapshot = await getDocs(collection(db, `users/${uid}/addresses`));
      setAddresses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.log("Error cargando direcciones:", error);
    }
  };

  const loadUserData = async (firebaseUser) => {
    if (!firebaseUser) {
      setUserData(null);
      setAddresses([]);
      setLoadingUser(false);
      return;
    }

    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setUserData({
          uid: firebaseUser.uid,
          name: "Usuario",
          email: firebaseUser.email || "",
        });
        setAddresses([]);
        return;
      }

      const data = userSnap.data();

      setUserData({
        uid: firebaseUser.uid,
        name: data.name || "Usuario",
        email: firebaseUser.email || "No definido",
        ...data,
      });
      fetchAddresses(firebaseUser.uid);

    } catch (err) {
      console.error("❌ Error en loadUserData:", err);
      if (err.code === "permission-denied") {
        setUserData(null); // forzamos logout indirecto
      }
    } finally {
      setLoadingUser(false);
    }
  };

  // 🔥 Listener de Auth
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      loadUserData(firebaseUser);
    });
    return unsub;
  }, []);

  return (
    <UserContext.Provider
      value={{
        userData,
        fetchAddresses,
        addresses,
        loadingUser,
        reloadUser: () => loadUserData(auth.currentUser),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
