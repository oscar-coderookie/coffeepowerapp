import { useTheme } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

/**
 * sortType puede ser:
 * - "az"   -> alfabético ascendente (A → Z)
 * - "za"   -> alfabético descendente (Z → A)
 * - "low"  -> precio ascendente (low -> high)
 * - "high" -> precio descendente (high -> low)
 * - null/undefined -> sin orden seleccionado (icono genérico)
 *
 * onPress: abrir modal o alternar orden según tu flujo.
 */
export default function SortButton({ onPress, sortType }) {
  const { colors } = useTheme();
  // Icono de flecha y label según tipo
  let arrowIcon = null; // "arrow-up" | "arrow-down" | null
  let mainLabel = "";   // texto horizontal (A-Z, Z-A, €)

  switch (sortType) {
    case "az":
      arrowIcon = "arrow-up";
      mainLabel = "A–Z";
      break;
    case "za":
      arrowIcon = "arrow-down";
      mainLabel = "Z–A";
      break;
    case "low":
      arrowIcon = "arrow-up";
      mainLabel = "€";
      break;
    case "high":
      arrowIcon = "arrow-down";
      mainLabel = "€";
      break;
    default:
      arrowIcon = null;
      mainLabel = ""; // sin label si no hay orden seleccionado
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.text }]}
      onPress={onPress}
      activeOpacity={0.85}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {/* Icono principal (por ejemplo A-Z o €) */}
      {mainLabel !== "" ? (
        <Text style={[styles.mainLabel, { color: colors.background }]}>Ordenar: {mainLabel}</Text>
      ) : (
        <Icon name="sort" size={16} color={colors.background} />
      )}

      {/* Flecha que cambia dirección (si aplica) */}
      {arrowIcon && (
        <View style={styles.arrowWrapper}>
          <Icon name={arrowIcon === "arrow-up" ? "arrow-up" : "arrow-down"} size={12} color={colors.background} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",// metálico oscuro
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginVertical: 10,
    minWidth: 44,
  },
  mainLabel: {
    fontSize: 13,
    letterSpacing: 1,
    fontFamily: "Jost_600SemiBold",
  },
  arrowWrapper: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
