// components/SearchBar.js
import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function SearchBar({ onSearch }) {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");

  const handleChange = (text) => {
    setQuery(text);
    onSearch && onSearch(text.trim().toLowerCase());
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background, // fondo Google pero dinámico
          shadowColor: colors.text,     // sombra dinámica
        },
      ]}
    >
      <Ionicons
        name="search-outline"
        size={20}
        color={colors.text} // icono Google pero dinámico
        style={styles.icon}
      />

      <TextInput
        placeholder="Buscar..."
        placeholderTextColor={colors.text}
        style={[styles.input, { color: colors.text}]}
        value={query}
        onChangeText={handleChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    borderRadius: 28,
    height: 48,
    paddingHorizontal: 14,
    marginBottom: 10,

    // sombra estilo Google
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Jost_400Regular",
  },
});
