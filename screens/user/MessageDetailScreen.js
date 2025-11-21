import React, { useEffect, useState, useContext } from "react";
import { View, Text, ScrollView } from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { AuthContext } from "../../context/AuthContext";
import CustomHeader from "../../components/CustomHeader";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function MessageDetailScreen({ route }) {
  const { user } = useContext(AuthContext);
  const { messageId } = route.params;
  const { colors } = useTheme();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      const ref = doc(db, "users", user.uid, "messages", messageId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setMessage(data);

        if (!data.read) {
          await updateDoc(ref, { read: true });
        }
      }
    };

    fetchMessage();
  }, []);

  if (!message) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <CustomHeader title={message.title} showBack />
      <ScrollView contentContainerStyle={{ padding: 10, paddingBottom: 60 }}>
        {/* CUERPO */}
         {/* FECHA */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Jost_400Regular",
              color: "#888",
            }}
          >
            
            Recibido: {message.createdAt ? (
              new Date(message.createdAt.toDate()).toLocaleString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
              
            )
             : (
              // Muestra un mensaje alternativo o null si la fecha no está disponible
              "Fecha no disponible"
            )}
            
          </Text>
          <Ionicons name="time-outline" size={18} color="#888" />
        </View>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Jost_400Regular",
            color: colors.text,
            lineHeight: 24,
          }}
        >
          {message.body}
        </Text>
      </ScrollView>
    </View>
  );
}
