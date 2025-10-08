import React, { useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";
import { CartContext } from "../context/CartContext";
import LoadingScreen from "../components/LoadingScreen";
import CountryPicker from "react-native-country-picker-modal";
import Icon from "react-native-vector-icons/FontAwesome";
import AvatarPicker from "../components/AvatarPicker";

export default function UserAreaScreen({ navigation }) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [address, setAddress] = useState({
    pais: "",
    ciudad: "",
    codigoPostal: "",
    calle: "",
    numero: "",
    piso: "",
    referencia: "",
  });
  const [phone, setPhone] = useState({ codigo: "57", numero: "" });
  const [countryCode, setCountryCode] = useState("CO");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const { colors } = useTheme();
  const { isLoading } = useContext(CartContext);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const session = await AsyncStorage.getItem("userSession");
        if (!session) {
          navigation.replace("Login");
          return;
        }

        const { name, email } = JSON.parse(session);
        setUserName(name);
        setUserEmail(email);

        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.direccion)
              setAddress((a) => ({ ...a, ...data.direccion }));
            if (data.phone) {
              const match = data.phone.match(/^\+(\d+)(\d+)/);
              if (match) {
                setPhone({ codigo: match[1], numero: match[2] });
              }
            }
          } else {
            // Si no existe el documento, lo crea vacío para evitar errores de updateDoc
            await setDoc(userRef, { direccion: {}, phone: "" });
          }
        }
      } catch (error) {
        console.log("Error verificando sesión:", error);
        navigation.replace("Login");
      } finally {
        setCheckingAuth(false);
      }
    };
    verifySession();
  }, []);

  if (checkingAuth || isLoading) {
    return <LoadingScreen message="Verificando sesión..." />;
  }

  const saveAddress = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return Alert.alert("Error", "Debes iniciar sesión.");
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { direccion: address });
      Alert.alert("Guardado", "Dirección actualizada correctamente ✅");
      setIsEditingAddress(false);
    } catch (error) {
      console.log("Error guardando dirección:", error);
      Alert.alert("Error", "No se pudo guardar la dirección.");
    }
  };

  const savePhone = async () => {
    if (!phone.numero) {
      Alert.alert("Número vacío", "Por favor, ingresa tu número.");
      return;
    }

    const formatted = `+${phone.codigo}${phone.numero.replace(/\D/g, "")}`;
    try {
      const user = auth.currentUser;
      if (!user) return Alert.alert("Error", "Debes iniciar sesión.");
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { phone: formatted });
      setIsEditingPhone(false);
      Alert.alert("Guardado", "Número de WhatsApp actualizado ✅");
    } catch (error) {
      console.log("❌ Error guardando número:", error);
      Alert.alert("Error", "No se pudo guardar el número. Intenta de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title={`Hola: ${userName?.toUpperCase() || "Usuario"} 👋`}
        showBack={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 10,
            }}
          >
            <AvatarPicker
              size={120}
              initialAvatar={avatar}
              onAvatarChange={setAvatar}
            />
          </View>

          <Text style={[styles.text, { color: colors.text }]}>
            Bienvenido a tu espacio personal de Coffee Power APP
          </Text>

          <View style={styles.infoContainer}>
            <Text
              style={[
                styles.title,
                { backgroundColor: colors.text, color: colors.background },
              ]}
            >
              Datos personales:
            </Text>

            <View style={styles.field}>
              {/* DIRECCIÓN */}
              {isEditingAddress ? (
                <View style={{ width: "100%" }}>
                  {/* Campos */}
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          flex: 1,
                          color: colors.text,
                          borderColor: colors.text,
                        },
                      ]}
                      value={address.pais}
                      onChangeText={(v) =>
                        setAddress((a) => ({ ...a, pais: v }))
                      }
                      placeholder="País"
                      placeholderTextColor={colors.text}
                    />
                    <TextInput
                      style={[
                        styles.input,
                        {
                          flex: 1,
                          color: colors.text,
                          borderColor: colors.text,
                        },
                      ]}
                      value={address.ciudad}
                      onChangeText={(v) =>
                        setAddress((a) => ({ ...a, ciudad: v }))
                      }
                      placeholder="Ciudad"
                      placeholderTextColor={colors.text}
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.text }]}
                    onPress={saveAddress}
                  >
                    <Text
                      style={[styles.buttonText, { color: colors.background }]}
                    >
                      Guardar dirección
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.addressBox]}>
                  <Text style={styles.addressTitle}>
                    📍 Dirección de Entrega:
                  </Text>
                  {Object.entries(address).map(([key, value]) => (
                    <View style={styles.addressRow} key={key}>
                      <Text style={styles.addressLabel}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </Text>
                      <Text style={styles.addressValue}>{value || "-"}</Text>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={[
                      styles.editBtn,
                      {
                        marginTop: 10,
                        backgroundColor: colors.background,
                      },
                    ]}
                    onPress={() => setIsEditingAddress(true)}
                  >
                    <Text
                      style={{
                        color: colors.text,
                        textTransform: "uppercase",
                        fontFamily: "Jost_600SemiBold",
                        textAlign: "center",
                      }}
                    >
                      Editar dirección de entrega
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* WHATSAPP */}
              <View
                style={[
                  styles.addressBox,
                  isEditingPhone && {
                    backgroundColor: colors.background,
                    borderWidth: 0,
                  },
                ]}
              >
                {isEditingPhone ? (
                  <View style={{ width: "100%" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
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
                          {
                            flex: 1,
                            color: colors.text,
                            borderColor: colors.text,
                          },
                        ]}
                        value={phone.numero}
                        onChangeText={(num) =>
                          setPhone((p) => ({ ...p, numero: num }))
                        }
                        placeholder="Número sin código de país"
                        placeholderTextColor={colors.text}
                        keyboardType="phone-pad"
                      />
                    </View>

                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: colors.text }]}
                      onPress={savePhone}
                    >
                      <Text
                        style={[styles.buttonText, { color: colors.background }]}
                      >
                        Guardar número
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <View style={styles.phoneRow}>
                      <Icon name="whatsapp" size={24} color="#25D366" />
                      <Text style={styles.addressTitle}> WhatsApp:</Text>
                    </View>

                    <View style={styles.addressRow}>
                      <Text style={styles.addressLabel}>Número:</Text>
                      <Text style={styles.addressValue}>
                        {phone.numero
                          ? `+${phone.codigo}${phone.numero}`
                          : "No registrado"}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.editBtn,
                        {
                          marginTop: 10,
                          backgroundColor: colors.background,
                        },
                      ]}
                      onPress={() => setIsEditingPhone(true)}
                    >
                      <Text
                        style={{
                          color: colors.text,
                          textTransform: "uppercase",
                          fontFamily: "Jost_600SemiBold",
                          textAlign: "center",
                        }}
                      >
                        {phone.numero ? "Editar número" : "Agregar número"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.text }]}
        onPress={() =>
          navigation.navigate("Nuestros Cafés", { screen: "Carrito" })
        }
      >
        <Text style={[styles.buttonText, { color: colors.background }]}>
          Ir a tu carrito
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start", paddingBottom: 20 },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textTransform: "uppercase",
    textAlign: "center",
    fontFamily: "Jost_700Bold",
    padding: 10,
  },
  text: {
    fontSize: 16,
    padding: 20,
    textAlign: "center",
    fontFamily: "Jost_400Regular",
  },
  button: { padding: 15, borderRadius: 8, margin: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    fontFamily: "Jost_400Regular",
    width: "100%",
    backgroundColor: "transparent",
  },
  editBtn: { borderWidth: 1, borderRadius: 8, padding: 14 },
  addressBox: {
    width: "100%",
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  addressTitle: {
    fontSize: 16,
    fontFamily: "Jost_700Bold",
    color: "#a88e19",
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },
  addressRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  addressLabel: {
    fontFamily: "Jost_600SemiBold",
    color: "#fff",
    width: 120,
    fontSize: 14,
  },
  phoneRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  addressValue: {
    fontFamily: "Jost_400Regular",
    color: "#ccc",
    fontSize: 14,
    flex: 1,
  },
  buttonText: {
    fontFamily: "Jost_700Bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
  infoContainer: { width: "100%" },
  field: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    padding: 10,
  },
});
