import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const SORT_OPTIONS = [
  { id: "az", label: "A→Z (Ascendente)" },
  { id: "za", label: "Z→A (Descendente)" },
  { id: "low", label: "Precio (Ascendente)" },
  { id: "high", label: "Precio (Descendente)" },
];

export default function SortToolCoffeePower({ visible, onClose, onSelect }) {
  const { colors } = useTheme();
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>

        <View style={styles.sheetContainer}>

          <LinearGradient
            colors={[
              colors.background,
              colors.gray,
              colors.background,
            ]}
            start={{ x: 1, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBox}
          >
            <Text style={[styles.title, { color: colors.gold }]}>Ordenar:</Text>

            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.option, { borderBottomColor: colors.border }]}
                onPress={() => {
                  onSelect(option.id);
                  onClose();
                }}
              >
                <Text style={[styles.optionText, { color: colors.text }]}>{option.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={[styles.closeText, { color: colors.gold }]}>Cerrar</Text>
            </TouchableOpacity>

          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },

  sheetContainer: {
    width: "100%",
    paddingBottom: 30,
  },

  gradientBox: {
    width: "100%",
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: "#000000ff",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
  },

  title: {
    fontSize: 18,
    fontFamily: "Jost_600SemiBold",
    color: "#c9a86a",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },

  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,

    borderBottomWidth: 1,
  },

  optionText: {
    fontSize: 16,
    fontFamily: "Jost_400Regular",
    textAlign: "center",
  },

  closeBtn: {
    marginTop: 10,
    paddingVertical: 12,
  },

  closeText: {
    fontSize: 16,
    fontFamily: "Jost_500Medium",
    textAlign: "center",
  },
});
