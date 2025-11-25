import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
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
import ComunidadProvinciaPicker from "./ComunityInput";
import ButtonGeneral from "./ButtonGeneral";
import { playSound } from "../utils/soundPlayer";
import Toast from "react-native-toast-message";
import { useTheme } from "@react-navigation/native";

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
    numero: "",
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
    if (!user) return Toast.show({
      type: "error",
      text1: "Error",
      text2: "Debes iniciar sesión.",
    });;

    try {
      const ref = doc(db, `users/${user.uid}/addresses/${addressId}`);
      await setDoc(ref, address, { merge: true });
      Toast.show({
        type: "success",
        text1: "Guardado",
        text2: "Dirección actualizada correctamente ✅",
      });
      setIsEditing(false);
      onUpdated?.();
    } catch (err) {
      console.log("Error guardando dirección:", err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo guardar la dirección.",
      });
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
              Toast.show({
                type: "error",
                text1: "Eliminada",
                text2: "La dirección fue eliminada ✅",
              });
            } catch (err) {
              console.log("Error eliminando dirección:", err);
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo eliminar la dirección.",
              });
            }
          },
        },
      ]
    );
  };

  return (
    <View
      style={styles.addressBox}
    >

      {/* Calle y numero */}
      <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.label, { color: colors.text }]}>Calle:</Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.text },
            ]}
            value={address.calle}
            onChangeText={(v) => setAddress((a) => ({ ...a, calle: v }))}
            placeholder="Calle *"
            placeholderTextColor={colors.text}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.label, { color: colors.text }]}>Numero:</Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.text },
            ]}
            value={address.numero}
            onChangeText={(v) => setAddress((a) => ({ ...a, numero: v }))}
            placeholder="Número"
            placeholderTextColor={colors.text}
            keyboardType="numeric"

          />
        </View>
      </View>
      {/* Código postal y piso */}
      <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.label, { color: colors.text }]}>Piso:</Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.text },
            ]}
            value={address.piso}
            onChangeText={(v) => setAddress((a) => ({ ...a, piso: v }))}
            placeholder="Piso"
            placeholderTextColor={colors.text}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.label, { color: colors.text }]}>Puerta:</Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.text },
            ]}
            value={address.puerta}
            onChangeText={(v) => setAddress((a) => ({ ...a, puerta: v }))}
            placeholder="Puerta"
            placeholderTextColor={colors.text}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.label, { color: colors.text }]}>CP:</Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.text },
            ]}
            value={address.codigoPostal}
            onChangeText={(v) =>
              setAddress((a) => ({ ...a, codigoPostal: v }))
            }
            placeholder="Código Postal*"
            placeholderTextColor={colors.text}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          {/* Referencia */}
          <Text style={[styles.label, { color: colors.text }]}>Referencias:</Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.text, flex: 1 },
            ]}
            value={address.referencia}
            onChangeText={(v) =>
              setAddress((a) => ({ ...a, referencia: v }))
            }
            placeholder="Referencias (opcional)"
            placeholderTextColor={colors.text}
          />
        </View>

      </View>
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

      {/* Botones editar y eliminar */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: "#555" }]}
          onPress={() => {
            playSound('click')
            setIsEditing(true)
          }}
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
  );
}

const styles = StyleSheet.create({
  addressBox: {
    marginTop: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 10
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    fontFamily: "Jost_400Regular",
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
  label: {
    fontFamily: 'Jost_600SemiBold',
    marginRight: 10
  }

});
