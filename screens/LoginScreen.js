import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { colors } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tus credenciales");
      return;
    }

    try {
      // 🔐 Iniciar sesión con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔎 Obtener datos del usuario en Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      let userName = "Usuario";
      if (userDoc.exists()) {
        userName = userDoc.data().name;
        
      }

      // 💾 Guardar sesión en AsyncStorage
      await AsyncStorage.setItem(
        "userSession",
        JSON.stringify({ uid: user.uid, name: userName, email: user.email })
      );

      // 🚀 Redirigir al área de usuario
      navigation.replace("UserArea");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          fontFamily: "Jost_400Regular",
          borderWidth: 1,
          borderColor: colors.text,
          padding: 10,
          color: colors.text,
          borderRadius: 8,
          marginBottom: 10,
        }}
        placeholderTextColor={colors.text}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // 👈 cambia entre visible u oculto
          style={{
            flex: 1,
            fontFamily: "Jost_400Regular",
            borderWidth: 1,
            color: colors.text,
            borderColor: colors.text,
            padding: 10,
            borderRadius: 8,
          }}
          placeholderTextColor={colors.text}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.showButton}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: colors.text,
          padding: 15,
          borderRadius: 8,
          marginTop: 10,
        }}
        onPress={handleLogin}
      >
        <Text
          style={{
            color: colors.background,
            textAlign: "center",
            fontFamily: "Jost_600SemiBold",
            textTransform: "uppercase",
          }}
        >
          Entrar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={[styles.link, { color: "tomato" }]}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start", padding: 20, marginTop: 100 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Jost_600SemiBold",
    textTransform: "uppercase",
  },
  link: { marginTop: 15, textAlign: "center", color: "#0066cc", fontFamily: "Jost_400Regular", },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  showButton: {
    position: "absolute",
    right: 10,
  },
});
