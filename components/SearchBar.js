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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Ionicons name="search-outline" size={22} color={colors.text} style={styles.icon} />
      <TextInput
        placeholder="Buscar..."
        placeholderTextColor={colors.text}
        style={[styles.input, { color: colors.text }]}
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
    marginHorizontal: 10,
    marginBottom: 8,
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 4,
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
