// src/components/toastConfig.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <LinearGradient colors={["#000000ff", "#2e2e2eff", "#000000ff", "#000000ff"]} style={styles.toast}>
      <Ionicons name="checkmark-circle-outline" size={28} color="#c5a572" />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{text1}</Text>
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </LinearGradient>
  ),

  error: ({ text1, text2 }) => (
    <LinearGradient colors={["#000000ff", "#2e2e2eff", "#000000ff", "#000000ff"]} style={styles.toast}>
      <Ionicons name="close-circle-outline" size={28} color="#ff6b6b" />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: "#ff6b6b" }]}>{text1}</Text>
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </LinearGradient>
  ),
    working: ({ text1, text2 }) => (
    <LinearGradient colors={["#000000ff", "#2e2e2eff", "#000000ff", "#000000ff"]} style={styles.toast}>
      <Ionicons name="time" size={28} color="#ffffffff" />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: "#ffffffff" }]}>{text1}</Text>
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </LinearGradient>
  ),

  info: ({ text1, text2 }) => (
    <LinearGradient colors={["#000000ff", "#2e2e2eff", "#000000ff", "#000000ff"]} style={styles.toast}>
      <Ionicons name="information-circle-outline" size={28} color="#8fb3ff" />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{text1}</Text>
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </LinearGradient>
  ),
  confirmDelete: ({ text1, onConfirm, onCancel }) => (
    <View style={[styles.toast, styles.confirmToast]}>
      <Ionicons name="alert-circle-outline" size={28} color="#ffcc00" />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: "#fff" }]}>{text1}</Text>
        <View style={styles.confirmButtons}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.btnText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
            <Text style={[styles.btnText, { color: "#000" }]}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  confirmToast: {
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#c5a572",
    padding: 16,
  },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  confirmBtn: {
    backgroundColor: "#c5a572",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
