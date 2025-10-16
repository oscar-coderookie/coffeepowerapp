// components/CustomPicker.js
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // puedes cambiar el ícono si quieres
import { useTheme } from "@react-navigation/native";

export default function ComunidadProvinciaPicker({ label, value, options, onChange }) {
  const [visible, setVisible] = useState(false);
  const {colors} = useTheme();

  const handleSelect = (item) => {
    onChange(item);
    setVisible(false);
  };

  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={[styles.label, {color:colors.text}]}>{label}</Text>
      <TouchableOpacity
        style={[styles.selector, {color: colors.text}]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={{color:colors.text,fontFamily: "Jost_400Regular",}}
        >
          {value || "Selecciona una opción"}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContainer}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 14,
    marginBottom: 5,
  },
  selector: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  value: {
    
    fontSize: 15,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: "70%",
    paddingVertical: 10,
    elevation: 5,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionText: {
    fontFamily: "Jost_400Regular",
    fontSize: 15,
    color: "#222",
  },
});
