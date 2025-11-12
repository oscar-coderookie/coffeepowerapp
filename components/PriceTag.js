// components/PriceTag.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function PriceTag({ price , currency = "€" }) {
  return (
    <LinearGradient
      colors={["#574016ff","#e4c561ff", "#574016ff"]} // Degradado dorado → amarillo a naranja
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <Text style={styles.priceText}>
        {price}{currency}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderTopStartRadius:0,
    borderBottomStartRadius:0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  priceText: {
    fontSize: 20,

    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: "Jost_600SemiBold",
  },
});
