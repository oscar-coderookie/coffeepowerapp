// components/WhatsappBlock.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import Icon from "react-native-vector-icons/FontAwesome";
import CountryPicker from "react-native-country-picker-modal";
import { useTheme } from "@react-navigation/native";

export default function WhatsappBlock() {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState({ codigo: "34", numero: "" });
  const [countryCode, setCountryCode] = useState("ES");
  const [isLoaded, setIsLoaded] = useState(false); // Para evitar sobrescribir mientras se edita

  // 🟢 Cargar número existente al montar
  useEffect(() => {
    const fetchPhone = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.phone) {
            setPhone({
              codigo: data.phone.codigo || "34",
              numero: data.phone.numero || "",
            });
            setCountryCode(getCountryCodeFromCallingCode(data.phone.codigo));
          }
        }
      } catch (err) {
        console.log("Error cargando teléfono:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchPhone();
  }, []);

  // 🔹 Función para mapear código de país a cca2 (puedes ajustarla según tus necesidades)
  const getCountryCodeFromCallingCode = (callingCode) => {
    switch (callingCode) {
      case "34":
        return "ES";
      default:
        return "ES";
    }
  };

  // 🟢 Guardar número
  const handleSave = async () => {
    if (!phone.numero) {
      Alert.alert("Número vacío", "Por favor, ingresa tu número.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) return Alert.alert("Error", "Debes iniciar sesión.");

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { phone }); // Guardamos objeto completo
      Alert.alert("Guardado", "Número de WhatsApp actualizado ✅");
      setIsEditing(false);
    } catch (error) {
      console.log("❌ Error guardando número:", error);
      Alert.alert("Error", "No se pudo guardar el número. Intenta de nuevo.");
    }
  };

  // 🔴 Eliminar número
  const handleDelete = async () => {
    Alert.alert("Eliminar número", "¿Seguro que deseas eliminar tu número?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const user = auth.currentUser;
            if (!user) return;
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { phone: { codigo: "34", numero: "" } });
            setPhone({ codigo: "34", numero: "" });
            Alert.alert("Eliminado", "Número eliminado correctamente ✅");
          } catch (err) {
            console.log("Error eliminando número:", err);
            Alert.alert("Error", "No se pudo eliminar el número.");
          }
        },
      },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isEditing ? colors.background : colors.text,
        },
      ]}
    >
      {isEditing ? (
        <View style={{ width: "100%" }}>
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCallingCode
              onSelect={(country) => {
                setCountryCode(country.cca2);
                setPhone((p) => ({
                  ...p,
                  codigo: country.callingCode[0],
                }));
              }}
            />
            <TextInput
              style={[
                styles.input,
                { flex: 1, color: colors.text, borderColor: colors.text },
              ]}
              value={phone.numero}
              onChangeText={(num) =>
                setPhone((p) => ({ ...p, numero: num }))
              }
              placeholder="Número sin código de país"
              placeholderTextColor={colors.text}
              keyboardType="phone-pad"
              maxLength={9}
              inputMode="tel"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.text }]}
            onPress={handleSave}
          >
            <Text style={[styles.buttonText, { color: colors.background }]}>
              Guardar número
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={styles.headerRow}>
            <Icon name="whatsapp" size={22} color="#25D366" />
            <Text
              style={[styles.title, { color: colors.background, marginLeft: 8 }]}
            >
              WhatsApp
            </Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={[styles.label, { color: colors.background }]}>
              Número:
            </Text>
            <Text style={[styles.value, { color: colors.background }]}>
              {phone.numero
                ? `+${phone.codigo}${phone.numero}`
                : "No registrado"}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: "#555" }]}
              onPress={() => setIsEditing(true)}
            >
              <Icon name="pencil" size={18} color="#fff" />
            </TouchableOpacity>

            {phone.numero ? (
              <TouchableOpacity
                style={[styles.iconBtn, { backgroundColor: "#d9534f" }]}
                onPress={handleDelete}
              >
                <Icon name="trash" size={18} color="#fff" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: "Jost_700Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 4,
  },
  label: {
    fontFamily: "Jost_600SemiBold",
    width: 100,
    fontSize: 14,
  },
  value: {
    fontFamily: "Jost_400Regular",
    fontSize: 14,
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
