import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function LoadingScreen({ message = "Cargando..." }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: colors.text}]}>
      <ActivityIndicator size="large" color={colors.background} />
      <Text style={[styles.text, { color: colors.background }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: "Jost_600SemiBold",
    textAlign: "center",
  },
});
