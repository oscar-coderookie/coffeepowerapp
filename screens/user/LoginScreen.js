import { useTheme } from "@react-navigation/native";
import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { AuthContext } from "../../context/AuthContext";
import ButtonGeneral from "../../components/ButtonGeneral";
import CustomHeader from "../../components/CustomHeader";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigation.replace("UserArea"); // ✅ navegación segura después del render
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tus credenciales");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userLogged = userCredential.user;

      if (!userLogged.emailVerified) {
        Alert.alert(
          "Cuenta no verificada",
          "Por favor, verifica tu correo antes de iniciar sesión."
        );
        return;
      }

      // El AuthContext detectará el usuario automáticamente y navegará
    } catch (error) {
      console.log("Error login:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="iniciar sesión:" />
      <View style={{ marginHorizontal: 10, marginTop: 20 }}>
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
            secureTextEntry={!showPassword}
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
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showButton}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
        <ButtonGeneral
          text="Login"
          textColor="white"
          bckColor={["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"]}
          borderColors={["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"]}
          onTouch={handleLogin} />

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={[styles.link, { color: "tomato" }]}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Jost_600SemiBold",
    textTransform: "uppercase",
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#0066cc",
    fontFamily: "Jost_400Regular",
  },
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
