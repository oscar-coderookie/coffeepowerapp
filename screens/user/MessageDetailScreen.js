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
      <CustomHeader title="Detalle Mensaje" showBack />

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }}>

        {/* TÍTULO */}
        <Text
          style={{
            fontSize: 26,
            fontFamily: "Jost_700Bold",
            color: colors.text,
            marginBottom: 12,
            letterSpacing: -0.3,
          }}
        >
          {message.title}
        </Text>

        {/* FECHA */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <Ionicons name="time-outline" size={18} color="#888" />
          <Text
            style={{
              marginLeft: 8,
              fontSize: 14,
              fontFamily: "Jost_400Regular",
              color: "#888",
            }}
          >
            {new Date(message.createdAt?.toDate()).toLocaleString()}
          </Text>
        </View>

        {/* CUERPO */}
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

        {/* CONDICIONES */}
        {message.conditions && (
          <View
            style={{
              marginTop: 25,
              backgroundColor: "#202020",
              padding: 16,
              borderRadius: 12,
              borderLeftColor: colors.primary || "#FFD700",
              borderLeftWidth: 4,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Jost_500Medium",
                color: "#ddd",
                marginBottom: 8,
              }}
            >
              Condiciones
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontFamily: "Jost_400Regular",
                color: "#bbb",
                lineHeight: 22,
              }}
            >
              {message.conditions}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
