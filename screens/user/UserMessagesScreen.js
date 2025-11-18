import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { collection, getDocs, updateDoc, doc, orderBy, query, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation, useTheme } from "@react-navigation/native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../../components/CustomHeader";
import { useFocusEffect } from "@react-navigation/native";

export default function UserMessagesScreen() {
  const { user } = useContext(AuthContext);
  const { colors } = useTheme();
  const [messages, setMessages] = useState([]);

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      if (!user) return;

      const ref = collection(db, `users/${user.uid}/messages`);
      const q = query(ref, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, snap => {
        const data = snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));
        setMessages(data);
      });

      return () => unsubscribe(); // 🔥 Limpia cuando salgas de la screen
    }, [user])
  );

  const renderItem = ({ item, index }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 150, type: "timing", duration: 500 }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("Detalle Mensaje", { messageId: item.id })}
        style={{
          padding: 16,
          backgroundColor: item.read ? colors.gray : "#2bb800ff",
          marginBottom: 12,
          borderRadius: 50,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            name={
              item.type === "promo"
                ? "pricetag-outline"
                : item.type === "alert"
                  ? "alert-circle-outline"
                  : "notifications-outline"
            }
            size={26}
            color={colors.text}

          />

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Jost_600SemiBold",
                color: colors.text,
                textAlign: 'justify',
                fontSize: 16,
              }}
            >
              {item.title}
            </Text>

            <Text
              style={{
                fontFamily: "Jost_400Regular",
                color: colors.text,
                marginTop: 5,
                fontSize: 12,
              }}
            >
              {item.body}
            </Text>

          </View>
          <Text
            style={{
              fontFamily: "Jost_400Regular",
              color: colors.text,
              marginTop: 5,
              fontSize: 12,
            }}
          >
            {item.createdAt}
          </Text>
        </View>
      </TouchableOpacity>
    </MotiView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <CustomHeader title="Mensajes" />
      <View style={{ marginHorizontal: 10 }}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 15 }}
        />
      </View>

    </View>
  );
}
