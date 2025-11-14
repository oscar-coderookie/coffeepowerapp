// components/CustomHeader.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useTheme } from "@react-navigation/native";
import { playSound } from "../utils/soundPlayer";
import { LinearGradient } from "expo-linear-gradient";

export default function CustomHeader({ title, children, showBack = false }) {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <LinearGradient
      pointerEvents="box-none"
      colors={[colors.gray,colors.card, colors.gray, colors.card]}
      start={{ x: 0.5, y: 0 }}   // arriba
  end={{ x: 0.5, y: 1 }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 10,
     

      }}
    >
      {/* Botón de retroceso */}
      {showBack ? (
        <TouchableOpacity

          onPress={() => {
            playSound('cup')
            navigation.goBack()
          }
          }>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}

      {/* Centro con título o children */}
      <View style={styles.center}>
        {children ? (
          children
        ) : (
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
            adjustsFontSizeToFit={true} // 👈 se adapta al ancho disponible
            minimumFontScale={0.75} // 👈 se achica hasta 75% si es necesario
          >
            {title}
          </Text>
        )}
      </View>

      <View style={{ width: 24 }} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    textTransform: "uppercase",
    fontFamily: "Jost_700Bold",
    textAlign: "center",
    width: "90%", // mantiene margen lateral para evitar recortes
  },
});
