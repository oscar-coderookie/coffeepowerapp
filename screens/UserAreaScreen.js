import React, { useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";
import { CartContext } from "../context/CartContext";
import LoadingScreen from "../components/LoadingScreen";
import CountryPicker from "react-native-country-picker-modal";
import Icon from 'react-native-vector-icons/FontAwesome';


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
  const [phone, setPhone] = useState("");
  const [rawPhone, setRawPhone] = useState(""); // <- número limpio sin código
  const [countryCode, setCountryCode] = useState("CO");
  const [callingCode, setCallingCode] = useState("57");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const { colors } = useTheme();
  const { logout, isLoading, user } = useContext(CartContext);

  // Cargar datos de usuario
  useEffect(() => {
    const loadUser = async () => {
      const session = await AsyncStorage.getItem("userSession");
      if (session) {
        const { name, email, uid } = JSON.parse(session);
        setUserName(name);
        setUserEmail(email);
        if (uid) {
          const userRef = doc(db, "users", uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.direccion) setAddress({ ...address, ...data.direccion });
            if (data.phone) {
              setPhone(data.phone);
              const clean = data.phone.replace(/^\+\d+/, ""); // quitar prefijo
              setRawPhone(clean);
            }
          }
        }
      }
    };
    loadUser();
  }, [user]);

  if (isLoading) return <LoadingScreen message="Cargando sesión..." />;

  const handleLogout = async () => {
    await logout();
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <CustomHeader title={`Hola: ${userName?.toUpperCase() || "Usuario"} 👋`} showBack={false} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView>
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
                  {/* País y Ciudad */}
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TextInput
                      style={[
                        styles.input,
                        { flex: 1, color: colors.text, borderColor: colors.text },
                      ]}
                      value={address.pais}
                      onChangeText={(v) => setAddress((a) => ({ ...a, pais: v }))}
                      placeholder="País"
                      placeholderTextColor={colors.text}
                    />
                    <TextInput
                      style={[
                        styles.input,
                        { flex: 1, color: colors.text, borderColor: colors.text },
                      ]}
                      value={address.ciudad}
                      onChangeText={(v) =>
                        setAddress((a) => ({ ...a, ciudad: v }))
                      }
                      placeholder="Ciudad"
                      placeholderTextColor={colors.text}
                    />
                  </View>

                  {/* Código Postal y Piso */}
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
                      placeholder="Código Postal"
                      placeholderTextColor={colors.text}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[
                        styles.input,
                        { flex: 1, color: colors.text, borderColor: colors.text },
                      ]}
                      value={address.piso}
                      onChangeText={(v) =>
                        setAddress((a) => ({ ...a, piso: v }))
                      }
                      placeholder="Piso/Depto (opcional)"
                      placeholderTextColor={colors.text}
                    />
                  </View>

                  {/* Calle y Número */}
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TextInput
                      style={[
                        styles.input,
                        { flex: 2, color: colors.text, borderColor: colors.text },
                      ]}
                      value={address.calle}
                      onChangeText={(v) =>
                        setAddress((a) => ({ ...a, calle: v }))
                      }
                      placeholder="Calle"
                      placeholderTextColor={colors.text}
                    />
                    <TextInput
                      style={[
                        styles.input,
                        { flex: 1, color: colors.text, borderColor: colors.text },
                      ]}
                      value={address.numero}
                      onChangeText={(v) =>
                        setAddress((a) => ({ ...a, numero: v }))
                      }
                      placeholder="Número"
                      placeholderTextColor={colors.text}
                      keyboardType="numeric"
                    />
                  </View>

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

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.text }]}
                    onPress={async () => {
                      setIsEditingAddress(false);
                      const session = await AsyncStorage.getItem("userSession");
                      if (session) {
                        const { uid } = JSON.parse(session);
                        if (uid) {
                          const userRef = doc(db, "users", uid);
                          await updateDoc(userRef, { direccion: address });
                        }
                      }
                    }}
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
                  <Text style={styles.addressTitle}>📍 Dirección de Entrega:</Text>
                  <View style={styles.addressRow}>
                    <Text style={styles.addressLabel}>País:</Text>
                    <Text style={styles.addressValue}>{address.pais || "-"}</Text>
                  </View>
                  <View style={styles.addressRow}>
                    <Text style={styles.addressLabel}>Ciudad:</Text>
                    <Text style={styles.addressValue}>
                      {address.ciudad || "-"}
                    </Text>
                  </View>
                  <View style={styles.addressRow}>
                    <Text style={styles.addressLabel}>Código Postal:</Text>
                    <Text style={styles.addressValue}>
                      {address.codigoPostal || "-"}
                    </Text>
                  </View>
                  <View style={styles.addressRow}>
                    <Text style={styles.addressLabel}>Calle:</Text>
                    <Text style={styles.addressValue}>
                      {address.calle || "-"}
                    </Text>
                  </View>
                  <View style={styles.addressRow}>
                    <Text style={styles.addressLabel}>Número:</Text>
                    <Text style={styles.addressValue}>
                      {address.numero || "-"}
                    </Text>
                  </View>
                  <View style={styles.addressRow}>
                    <Text style={styles.addressLabel}>Piso/Depto:</Text>
                    <Text style={styles.addressValue}>
                      {address.piso || "-"}
                    </Text>
                  </View>
                  <View style={styles.addressRow}>
                    <Text style={styles.addressLabel}>Referencias:</Text>
                    <Text style={styles.addressValue}>
                      {address.referencia || "-"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.editBtn,
                      { marginTop: 10, backgroundColor: colors.background },
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
                  styles.addressBox, // mismo estilo que arriba
                  isEditingPhone && { backgroundColor: colors.background, borderWidth: 0 },
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
                          setCallingCode(country.callingCode[0]);
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
                        value={rawPhone}
                        onChangeText={setRawPhone}
                        placeholder="Número sin código de país"
                        placeholderTextColor={colors.text}
                        keyboardType="phone-pad"
                      />
                    </View>

                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: colors.text }]}
                      onPress={async () => {
                        if (!rawPhone) {
                          Alert.alert(
                            "Número vacío",
                            "Por favor, ingresa tu número."
                          );
                          return;
                        }
                        const formatted = `+${callingCode}${rawPhone.replace(/\D/g, "")}`;
                        const session = await AsyncStorage.getItem("userSession");
                        if (session) {
                          const { uid } = JSON.parse(session);
                          if (uid) {
                            const userRef = doc(db, "users", uid);
                            await updateDoc(userRef, { phone: formatted });
                            setPhone(formatted);
                          }
                        }
                        setIsEditingPhone(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          { color: colors.background },
                        ]}
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
                        { phone || "No registrado"}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.editBtn,
                        { marginTop: 10, backgroundColor: colors.background },
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
                        {phone ? "Editar número" : "Agregar número"}
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

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.text }]}
        onPress={handleLogout}
      >
        <Text
          style={[styles.buttonText, { color: colors.background }]}
        >
          Cerrar Sesión
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
  editBtn: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
  },
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
  phoneRow: {
    alignItems:'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10
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
