// OrderTimeline.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { MotiView, MotiText } from "moti";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ORDER_STEPS = [
  { key: "pending", label: "Preparando", color: "#E53935", icon: "package-variant-closed" },
  { key: "tracking", label: "Despachado", color: "#FB8C00", icon: "truck-delivery" },
  { key: "delivered", label: "Entregado", color: "#43A047", icon: "check-circle" }
];

export default function OrderTimeline({ currentStatus }) {
  const { colors } = useTheme();
  const currentIndex = ORDER_STEPS.findIndex(s => s.key === currentStatus);

  return (
    <View style={styles.container}>
      {/* Línea + círculos */}
      <View style={styles.row}>
        {ORDER_STEPS.map((step, i) => {
          const active = i <= currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <React.Fragment key={step.key}>
              {/* Círculo animado */}
              <MotiView
                from={{ scale: 1 }}
                animate={{ scale: isCurrent ? 1.25 : 1 }}
                transition={{
                  type: "timing",
                  duration: 600,
                  loop: isCurrent,
                }}
                style={[
                  styles.circle,
                  { backgroundColor: active ? step.color : colors.border }
                ]}
              >
                <MaterialCommunityIcons name={step.icon} size={16} color="#fff" />
              </MotiView>

              {/* Línea */}
              {i < ORDER_STEPS.length - 1 && (
                <View
                  style={[
                    styles.line,
                    { backgroundColor: i < currentIndex ? step.color : colors.border }
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* Labels */}
      <View style={styles.labelsRow}>
        {ORDER_STEPS.map((step, i) => {
          const active = i <= currentIndex;

          return (
            <MotiText
              key={step.key}
              from={{ opacity: 0.4 }}
              animate={{ opacity: active ? 1 : 0.5 }}
              transition={{ type: "timing", duration: 400 }}
              style={[
                styles.label,
                {
                  color: colors.text,
                  fontFamily: active ? "Jost_700Bold" : "Jost_400Regular"
                }
              ]}
            >
              {step.label}
            </MotiText>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 25
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center"
  },
  line: {
    flex: 1,
    height: 3,
    marginHorizontal: 4,
    borderRadius: 2
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  label: {
    fontSize: 12
  }
});
