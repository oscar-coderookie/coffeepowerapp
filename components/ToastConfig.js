// src/components/toastConfig.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <LinearGradient colors={["#000000ff", "#2e2e2eff","#000000ff", "#000000ff"]} style={styles.toast}>
      <Ionicons name="checkmark-circle-outline" size={28} color="#c5a572" />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{text1}</Text>
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </LinearGradient>
  ),

  error: ({ text1, text2 }) => (
    <LinearGradient colors={["#000000ff", "#2e2e2eff","#000000ff", "#000000ff"]} style={styles.toast}>
      <Ionicons name="close-circle-outline" size={28} color="#ff6b6b" />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: "#ff6b6b" }]}>{text1}</Text>
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </LinearGradient>
  ),

  info: ({ text1, text2 }) => (
    <LinearGradient colors={["#000000ff", "#2e2e2eff","#000000ff", "#000000ff"]} style={styles.toast}>
      <Ionicons name="information-circle-outline" size={28} color="#8fb3ff" />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{text1}</Text>
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </LinearGradient>
  ),
};

const styles = StyleSheet.create({
  toast: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 10,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    gap: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  message: {
    fontSize: 13,
    color: "#ddd",
  },
});
