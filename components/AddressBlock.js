import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { comunidades } from "../data/spainRegions";
import Icon from "react-native-vector-icons/FontAwesome";
import { useTheme } from "@react-navigation/native";
import ComunidadProvinciaPicker from "./ComunityInput";
import { LinearGradient } from "expo-linear-gradient";
import ButtonGeneral from "./ButtonGeneral";
import { playSound } from "../utils/soundPlayer";

export default function AddressBlock({
  addressId,
  initialData = {},
  onDeleted,
  onUpdated,
}) {
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
    if (initialData) setAddress(initialData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 👈 ejecuta solo al montar

  // guardar dirección
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return Alert.alert("Error", "Debes iniciar sesión.");

    try {
      const ref = doc(db, `users/${user.uid}/addresses/${addressId}`);
      await setDoc(ref, address, { merge: true });
      Alert.alert("Guardado", "Dirección actualizada correctamente ✅");
      setIsEditing(false);
      onUpdated?.();
    } catch (err) {
      console.log("Error guardando dirección:", err);
      Alert.alert("Error", "No se pudo guardar la dirección.");
    }
  };

  // eliminar dirección
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
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={
        isEditing
          ? []
          : ["#000000ff", "#363636ff", "#000000ff", "#363636ff", "#000000ff"]
      }
      style={styles.addressBox}
    >
      {isEditing ? (
        <View style={{ width: "100%" }}>
          {/* Comunidad y provincia */}
          <View style={{ flexDirection: "column", gap: 10 }}>
            <ComunidadProvinciaPicker
              label="Comunidad Autónoma"
              value={address.CA}
              options={comunidades.map((ca) => ca.nombre)}
              onChange={(value) => {
                setAddress((a) => {
                  // si cambia la CA, reiniciamos provincia
                  if (a.CA !== value) {
                    return { ...a, CA: value, provincia: "" };
                  }
                  return a;
                });
              }}
            />

            {/* ✅ SIN key — ya no se resetea */}
            <ComunidadProvinciaPicker
              label="Provincia"
              value={address.provincia}
              options={
                comunidades.find((ca) => ca.nombre === address.CA)?.provincias ||
                []
              }
              onChange={(value) =>
                setAddress((a) => ({ ...a, provincia: value }))
              }
            />
          </View>

          {/* Código postal y piso */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              style={[
                styles.input,
                { flex: 1, color: colors.text, borderColor: colors.text },
              ]}
              value={address.codigoPostal}
              onChangeText={(v) =>
                setAddress((a) => ({ ...a, codigoPostal: v }))
              }
              placeholder="Código Postal*"
              placeholderTextColor={colors.text}
              keyboardType="numeric"
              maxLength={9}
            />
            <TextInput
              style={[
                styles.input,
                { flex: 1, color: colors.text, borderColor: colors.text },
              ]}
              value={address.piso}
              onChangeText={(v) => setAddress((a) => ({ ...a, piso: v }))}
              placeholder="Piso/Depto (opcional)"
              placeholderTextColor={colors.text}
            />
          </View>

          {/* Calle y puerta */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              style={[
                styles.input,
                { flex: 2, color: colors.text, borderColor: colors.text },
              ]}
              value={address.calle}
              onChangeText={(v) => setAddress((a) => ({ ...a, calle: v }))}
              placeholder="Calle *"
              placeholderTextColor={colors.text}
            />
            <TextInput
              style={[
                styles.input,
                { flex: 1, color: colors.text, borderColor: colors.text },
              ]}
              value={address.puerta}
              onChangeText={(v) => setAddress((a) => ({ ...a, puerta: v }))}
              placeholder="Puerta"
              placeholderTextColor={colors.text}
            />
          </View>

          {/* Referencia */}
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.text },
            ]}
            value={address.referencia}
            onChangeText={(v) =>
              setAddress((a) => ({ ...a, referencia: v }))
            }
            placeholder="Referencias (opcional)"
            placeholderTextColor={colors.text}
          />

          {/* Botón guardar */}
          <ButtonGeneral
            text="guardar dirección"
            textColor="white"
            bckColor={[
              "#000000ff",
              "#535353ff",
              "#000000ff",
              "#6b6b6bff",
              "#000000ff",
            ]}
            borderColors={[
              "#535353ff",
              "#000000ff",
              "#535353ff",
              "#000000ff",
              "#535353ff",
            ]}
            onTouch={handleSave}
            soundType="click"
          />
        </View>
      ) : (
        <View>
          <Text style={styles.addressTitle}>📍 Dirección de entrega</Text>
          {Object.entries(address)
            .filter(([key]) => key !== "id")
            .map(([key, value]) => (
              <View style={styles.addressRow} key={key}>
                <Text style={[styles.addressLabel, { color: "white" }]}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </Text>
                <Text style={[styles.addressValue, { color: "white" }]}>
                  {value || "-"}
                </Text>
              </View>
            ))}

          {/* Botones editar y eliminar */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: "#555" }]}
              onPress={() => {
                playSound('click')
                setIsEditing(true)}}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  addressBox: {
    width: "100%",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    padding: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    fontFamily: "Jost_400Regular",
    backgroundColor: "transparent",
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
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
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
