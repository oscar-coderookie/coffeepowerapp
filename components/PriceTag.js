// components/PriceTag.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function PriceTag({ price , currency = "€" }) {
  return (
    <LinearGradient
      colors={["#574016ff","#e4c561ff", "#574016ff"]} // Degradado dorado → amarillo a naranja
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
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
    padding: 10,
    marginRight:10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
