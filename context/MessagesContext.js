import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "./AuthContext";

export const MessagesContext = createContext();

export function MessagesProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Contador de no leídos
  const unreadCount = messages.filter(m => !m.read && !m.deleted).length;

  // Listener Firestore
  useEffect(() => {
    if (!user) return;

    const ref = collection(db, `users/${user.uid}/messages`);
    const q = query(
      ref,
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setMessages(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Método para eliminar mensajes
  const deleteMessage = async (id) => {
    await updateDoc(doc(db, `users/${user.uid}/messages/${id}`), {
      deleted: true
    });
  };

  // Método para marcar como leído
  const markAsRead = async (id) => {
    await updateDoc(doc(db, `users/${user.uid}/messages/${id}`), {
      read: true
    });
  };

  return (
    <MessagesContext.Provider value={{
      messages,
      unreadCount,
      loading,
      deleteMessage,
      markAsRead
    }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  return useContext(MessagesContext);
}
