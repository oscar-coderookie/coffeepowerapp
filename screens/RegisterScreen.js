// screens/RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useTheme();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
      // 1️⃣ Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2️⃣ Guardar datos extra en Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date(),
      });

      Alert.alert("Éxito", "Registro completado");
      navigation.replace("Login");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "El correo ya está registrado");
      } else {
        Alert.alert("Error", "No se pudo registrar el usuario");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={[
          styles.input,
          { borderColor: colors.text, color: colors.text },
        ]}
        placeholderTextColor={colors.text}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={[
          styles.input,
          { borderColor: colors.text, color: colors.text },
        ]}
        placeholderTextColor={colors.text}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[
          styles.input,
          { borderColor: colors.text, color: colors.text },
        ]}
        placeholderTextColor={colors.text}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.text }]}
        onPress={handleRegister}
      >
        <Text
          style={{
            color: colors.background,
            textAlign: "center",
            fontFamily: "Jost_600SemiBold",
            textTransform: "uppercase",
          }}
        >
          Registrarse
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 100 },
  title: {
    fontSize: 24,
    fontFamily: "Jost_600SemiBold",
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
  },
  input: {
    fontFamily: "Jost_400Regular",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#0066cc",
    fontFamily: "Jost_400Regular",
  },
});
