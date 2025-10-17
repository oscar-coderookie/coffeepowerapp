import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { auth, db } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RegisterScreen({ navigation }) {
  const { colors } = useTheme();

  // Estados
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(null); // null, true o false

  // Lista de dominios permitidos
  const allowedDomains = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "icloud.com", "live.com"];

  // Validación de formato básico
  const isValidEmailFormat = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validación de dominio local
  const isValidEmailDomain = (email) => {
    const domain = email.split("@")[1];
    return domain && allowedDomains.includes(domain.toLowerCase());
  };
  // Validación de contraseña
  const validatePassword = (pass) => {
    const lengthValid = pass.length >= 6 && pass.length <= 12;
    const uppercaseValid = /[A-Z]/.test(pass);
    const symbolValid = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return lengthValid && uppercaseValid && symbolValid;
  };
  // Manejo en tiempo real del email
  const handleEmailChange = (text) => {
    setEmail(text);
    if (isValidEmailFormat(text) && isValidEmailDomain(text)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  // Registrar usuario
  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    if (!emailValid) {
      Alert.alert("Error", "El correo debe ser válido y de un dominio conocido.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        email: email.trim(),
        createdAt: new Date(),
        cart: [],
        favorites: [],
        verified: false
      });
      Alert.alert("Éxito", "Registro completado con éxito.");
      navigation.replace("Login");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "El correo ya está registrado.");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      } else {
        Alert.alert("Error", "No se pudo registrar el usuario.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordValid(validatePassword(text));
  };


  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Registro</Text>
      <Text
        style={{
          color: colors.text,
          marginBottom: 10,
          fontFamily: "Jost_400Regular",
        }}
      >
        Introduce tus datos para el registro:
      </Text>

      {/* Nombre */}
      <TextInput
        placeholder="Nombre completo"
        value={name}
        onChangeText={setName}
        style={[styles.input, { borderColor: colors.text, color: colors.text }]}
        placeholderTextColor={colors.text}
      />

      {/* Email con check/X */}
      <View style={[styles.passwordContainer, { borderColor: colors.text }]}>
        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={handleEmailChange}
          style={[styles.passwordInput, { color: colors.text }]}
          placeholderTextColor={colors.text}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {email.length > 0 && (
          <Ionicons
            name={emailValid ? "checkmark-circle" : "close-circle"}
            size={22}
            color={emailValid ? "green" : "red"}
          />
        )}
      </View>

      {/* Contraseña */}
      <View style={[styles.passwordContainer, { borderColor: colors.text }]}>
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry={!showPassword}
          style={[styles.passwordInput, { color: colors.text }]}
          placeholderTextColor={colors.text}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>
        {password.length > 0 && (
          <Ionicons
            name={passwordValid ? "checkmark-circle" : "close-circle"}
            size={22}
            color={passwordValid ? "green" : "red"}
            style={{ marginLeft: 8 }}
          />
        )}

      </View>
      <Text style={{ fontFamily: 'Jost_400Regular', fontSize: 9, textAlign: 'center', color: colors.text }}>La contraseña debe tener al menos 6 caracteres, una mayúscula y un símbolo especial.</Text>
      {/* Botón */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: loading ? "#999" : colors.text }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.background} />
        ) : (
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
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text
          style={[styles.link, { color: colors.text, opacity: 0.7, marginTop: 15 }]}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 100 },
  title: { fontSize: 24, fontFamily: "Jost_600SemiBold", marginBottom: 20, textAlign: "center", textTransform: "uppercase" },
  input: { fontFamily: "Jost_400Regular", borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 },
  passwordContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 },
  passwordInput: { flex: 1, fontFamily: "Jost_400Regular", paddingVertical: 10 },
  button: { padding: 15, borderRadius: 8, marginTop: 10 },
  link: { textAlign: "center", fontFamily: "Jost_400Regular" },
});
