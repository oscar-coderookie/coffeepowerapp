// components/AddressBlock.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import Icon from "react-native-vector-icons/FontAwesome";
import { useTheme } from "@react-navigation/native";
import ComunidadProvinciaPicker from "./ComunityInput";

export default function AddressBlock({ addressId,
  initialData = {},
  onDeleted,
  onUpdated,
  isEditingAddress = false,
  setIsEditingAddress = () => { } }) {
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState({
    CA: "",
    provincia: "",
    codigoPostal: "",
    calle: "",
    puerta: "",
    piso: "",
    referencia: "",
  });
  const { colors } = useTheme();

  useEffect(() => {
    setIsEditing(isEditingAddress);
  }, [isEditingAddress]);

  useEffect(() => {
    if (initialData) setAddress(initialData);
  }, [initialData]);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return Alert.alert("Error", "Debes iniciar sesión.");

    try {
      const ref = doc(db, `users/${user.uid}/addresses/${addressId}`);
      await setDoc(ref, address, { merge: true });
      Alert.alert("Guardado", "Dirección actualizada correctamente ✅");
      setIsEditingAddress(false);
      onUpdated?.();
    } catch (err) {
      console.log("Error guardando dirección:", err);
      Alert.alert("Error", "No se pudo guardar la dirección.");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Eliminar dirección",
      "¿Estás seguro de eliminar esta dirección?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              const ref = doc(db, `users/${user.uid}/addresses/${addressId}`);
              await deleteDoc(ref);
              onDeleted?.(addressId);
              Alert.alert("Eliminada", "La dirección fue eliminada ✅");
            } catch (err) {
              console.log("Error eliminando dirección:", err);
              Alert.alert("Error", "No se pudo eliminar la dirección.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.addressBox, { backgroundColor: isEditing ? colors.background : colors.text }]}>
      {isEditing ? (
        <View style={{ width: "100%", }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {/* <TextInput
              style={[styles.input, { flex: 1, color: colors.text, borderColor: colors.text }]}
              value={address.CA}
              onChangeText={(v) => setAddress((a) => ({ ...a, CA: v }))}
              placeholder="Comunidad Autónoma"
              placeholderTextColor={colors.text}
            /> */}
            <ComunidadProvinciaPicker
              valueCA={address.CA}
              valueProv={address.provincia}
              onChangeCA={(value) => setAddress((a) => ({ ...a, CA: value }))}
              onChangeProv={(value) => setAddress((a) => ({ ...a, provincia: value }))}
            />
            {/* <TextInput
              style={[styles.input, { flex: 1, color: colors.text, borderColor: colors.text }]}
              value={address.provincia}
              onChangeText={(v) => setAddress((a) => ({ ...a, provincia: v }))}
              placeholder="Provincia"
              placeholderTextColor={colors.text}
            /> */}
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              style={[styles.input, { flex: 1, color: colors.text, borderColor: colors.text }]}
              value={address.codigoPostal}
              onChangeText={(v) => setAddress((a) => ({ ...a, codigoPostal: v }))}
              placeholder="Código Postal"
              placeholderTextColor={colors.text}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { flex: 1, color: colors.text, borderColor: colors.text }]}
              value={address.piso}
              onChangeText={(v) => setAddress((a) => ({ ...a, piso: v }))}
              placeholder="Piso/Depto (opcional)"
              placeholderTextColor={colors.text}
            />
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              style={[styles.input, { flex: 2, color: colors.text, borderColor: colors.text }]}
              value={address.calle}
              onChangeText={(v) => setAddress((a) => ({ ...a, calle: v }))}
              placeholder="Calle"
              placeholderTextColor={colors.text}
            />
            <TextInput
              style={[styles.input, { flex: 1, color: colors.text, borderColor: colors.text }]}
              value={address.puerta}
              onChangeText={(v) => setAddress((a) => ({ ...a, numero: v }))}
              placeholder="Puerta"
              placeholderTextColor={colors.text}
              keyboardType="text"
            />
          </View>

          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.text }]}
            value={address.referencia}
            onChangeText={(v) => setAddress((a) => ({ ...a, referencia: v }))}
            placeholder="Referencias (opcional)"
            placeholderTextColor={colors.text}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.text }]}
            onPress={handleSave}
          >
            <Text style={[styles.buttonText, { color: colors.background }]}>
              Guardar dirección
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ backgroundColor: colors.text }}>
          <Text style={styles.addressTitle}>📍 Dirección de entrega</Text>
          {Object.entries(address)
            .filter(([key]) => key !== "id")
            .map(([key, value]) => (
              <View style={styles.addressRow} key={key}>
                <Text style={[styles.addressLabel, { color: colors.background }]}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </Text>
                <Text style={[styles.addressValue, { color: colors.background }]}>{value || "-"}</Text>
              </View>
            ))}

          {/* BOTONES EDITAR Y ELIMINAR */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: "#555" }]}
              onPress={() => setIsEditingAddress(true)}
            >
              <Icon name="pencil" size={18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: "#d9534f" }]}
              onPress={handleDelete}
            >
              <Icon name="trash" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addressBox: {
    width: "100%",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    fontFamily: "Jost_400Regular",
    backgroundColor: "transparent",
  },
  button: { padding: 15, borderRadius: 8, marginTop: 8 },
  buttonText: {
    fontFamily: "Jost_700Bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
  addressTitle: {
    fontSize: 16,
    fontFamily: "Jost_700Bold",
    color: "#a88e19",
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 10,
  },
  addressRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  addressLabel: {
    fontFamily: "Jost_600SemiBold",
    color: "#fff",
    width: 120,
    fontSize: 14,
  },
  addressValue: {
    fontFamily: "Jost_400Regular",
    color: "#ccc",
    fontSize: 14,
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 12,
  },
  iconBtn: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
  },
});
