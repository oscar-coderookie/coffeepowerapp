import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import {
  collection,
  updateDoc,
  doc,
  orderBy,
  query,
  onSnapshot,
  where
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../../components/CustomHeader";
import { useFocusEffect } from "@react-navigation/native";
import { formatFirestoreDateCompact } from "../../utils/dateFormatter";
import { playSound } from "../../utils/soundPlayer";
import SwipeToDelete from "../../components/SwipeToDelete";
import Toast from "react-native-toast-message";
import { useMessages } from "../../context/MessagesContext";

export default function UserMessagesScreen() {
  const { user } = useContext(AuthContext);
  const { messages, deleteMessage } = useMessages();
  const { colors } = useTheme();
  const navigation = useNavigation();

  // -----------------------------
  // 🔥 SECCIÓN SELECCIONADA
  // -----------------------------
  const [section, setSection] = useState("inbox");

  const handleDeleteMessage = async (id) => {
    try {
      deleteMessage(id)
      Toast.show({ type: "success", text1: "Mensaje eliminado" });
    } catch (err) {
      console.error(err);
      Toast.show({ type: "error", text1: "Error al eliminar mensaje" });
    }
  };

  const messageColors = {
    info: "#3498db",
    warning: "#f1c40f",
    error: "#e74c3c",
    success: "#2ecc71",
    promo: "#9b59b6",
    coupon: "#e67e22",
  };

  // ---------------------------------------------
  // 🔥 FIRESTORE: SOLO mensajes NO eliminados
  // ---------------------------------------------

  // ---------------------------------------------
  // 🔥 FILTRADO LOCAL SEGÚN SECCIÓN
  // ---------------------------------------------
  let dataToRender = [];

  if (section === "inbox") {
    dataToRender = messages.filter(m => !m.deleted);
  } else if (section === "unread") {
    dataToRender = messages.filter(m => !m.read && !m.deleted);
  } else if (section === "trash") {
    dataToRender = messages.filter(m => m.deleted);
  }

  // ---------------------------------------------
  // 🔥 RENDER ITEM
  // ---------------------------------------------
  const renderItem = ({ item, index }) => {
    const { date, time } = formatFirestoreDateCompact(item.createdAt);

    const backgroundColor = item.read
      ? colors.gray
      : messageColors[item.type] || "#2bb800ff";

    return (
      <SwipeToDelete
        itemId={item.id}
        index={index}
        onSwipe={() => handleDeleteMessage(item.id)}
        borderRadius={50}
      >
        <TouchableOpacity
          onPress={() => {
            playSound("click");
            navigation.navigate("Detalle Mensaje", { messageId: item.id });
          }}
          style={{
            padding: 16,
            marginHorizontal: 6,
            backgroundColor: backgroundColor,
            borderRadius: 50,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name={
                item.type === "promo"
                  ? item.read
                    ? "pricetag-outline"
                    : "pricetag"
                  : item.type === "alert"
                    ? item.read
                      ? "alert-circle-outline"
                      : "alert-circle"
                    : item.read
                      ? "notifications-outline"
                      : "notifications"
              }
              size={26}
              color={colors.text}
            />

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text
                style={{
                  fontFamily: "Jost_600SemiBold",
                  color: colors.text,
                  textAlign: "justify",
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

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontFamily: "Jost_400Regular",
                  color: colors.text,
                  fontSize: 12,
                }}
              >
                {date}
              </Text>
              <Text
                style={{
                  fontFamily: "Jost_400Regular",
                  color: colors.text,
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                {time}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </SwipeToDelete>
    );
  };

  // ---------------------------------------------
  // 🔥 UI: SELECTOR DE SECCIÓN (TABS SUPERIORES)
  // ---------------------------------------------
  const tabs = [
    { key: "inbox", label: "Bandeja" },
    { key: "unread", label: "Nuevos" },
    { key: "trash", label: "Eliminados" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <CustomHeader title="Mensajes" />

      <View style={{ marginHorizontal: 10, paddingTop: 20 }}>

        {/* 🔥 TABS SUPERIORES */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          {tabs.map((t) => (
            <TouchableOpacity
              key={t.key}
              onPress={() => setSection(t.key)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 20,
                backgroundColor:
                  section === t.key ? colors.text : colors.gray,
              }}
            >
              <Text
                style={{
                  fontFamily: "Jost_500Medium",
                  color: section === t.key ? colors.background : colors.text,
                }}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🔥 LISTA */}
        <FlatList
          data={dataToRender}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}
