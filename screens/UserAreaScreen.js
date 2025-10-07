import React, { useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";
import { CartContext } from "../context/CartContext";

export default function UserAreaScreen({ navigation }) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const { colors } = useTheme();
  const { logout } = useContext(CartContext);

  useEffect(() => {
    const loadUser = async () => {
      const session = await AsyncStorage.getItem("userSession");
      if (session) {
        const { name, email } = JSON.parse(session);
        setUserName(name);
        setUserEmail(email)
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <CustomHeader title={`Hola: ${userName?.toUpperCase() || "Usuario"} 👋`} showBack={false} />
      <ScrollView>
        <Text style={[styles.text, { color: colors.text }]}>'Bienvenido a tu espacio personal de Coffee Power APP'</Text>

        <View style={styles.infoContainer}>
          <Text style={[styles.title, { backgroundColor: colors.text, color: colors.background }]}>Datos personales:</Text>
          <View style={styles.field}>
            <Text style={{ color: colors.text }}>Nombre:</Text>
            <Text style={{ color: colors.text }}>{userName}</Text>
          </View>
          <View style={styles.field}>
            <Text style={{ color: colors.text }}>Correo Electrónico:</Text>
            <Text style={{ color: colors.text }}>{userEmail}</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.text }]} onPress={handleLogout}>
        <Text style={[styles.buttonText, { color: colors.background, }]}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textTransform: 'uppercase', textAlign: 'center', fontFamily: "Jost_700Bold" },
  text: { fontSize: 16, marginBottom: 20, padding: 20, textAlign: 'center', fontFamily: "Jost_400Regular" },
  button: { padding: 15, borderRadius: 8, margin: 10 },
  buttonText: { fontFamily: "Jost_700Bold", textTransform: 'uppercase', textAlign: 'center' },
  infoContainer: {
    width: '100%',

  },
  field: {
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    padding: 10
  }
});
