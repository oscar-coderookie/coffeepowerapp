import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";
import {
  auth,
  // no EmailAuthProvider aquí
  // no reauthenticateWithCredential aquí
} from "../config/firebase";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export default function ChangePasswordDirect({ onSuccess }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordValid, setPasswordValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  // Validación de la nueva contraseña
  const validatePassword = (pass) => {
    const lengthValid = pass.length >= 6 && pass.length <= 12;
    const uppercaseValid = /[A-Z]/.test(pass);
    const symbolValid = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return lengthValid && uppercaseValid && symbolValid;
  };

  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
    setPasswordValid(validatePassword(text));
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("Error", "Por favor completa ambos campos");
       Toast.show({
        type: "error",
        text1: "Error",
        text2: "Por favor completa ambos campos",
      });
      return;
    }

    if (!passwordValid) {
      Alert.alert("Error", "La nueva contraseña no cumple los requisitos");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "La nueva contraseña no cumple los requisitos",
      });
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      // Re-autenticación
      await reauthenticateWithCredential(user, credential);

      // Actualización de contraseña
      await updatePassword(user, newPassword);
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Contraseña actualizada satisfactoriamente.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setPasswordValid(null);

      if (onSuccess) onSuccess(); // oculta el formulario
    } catch (error) {
      console.error(error);
      if (error.code === "auth/wrong-password") {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "La contraseña actual es incorrecta",
        });
      } else {
        Alert.alert("Error", error.message);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Contraseña actual */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Contraseña actual"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={!showCurrent}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
          <Ionicons name={showCurrent ? "eye-off" : "eye"} size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Nueva contraseña */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nueva contraseña"
          value={newPassword}
          onChangeText={handleNewPasswordChange}
          secureTextEntry={!showNew}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={() => setShowNew(!showNew)}>
          <Ionicons name={showNew ? "eye-off" : "eye"} size={22} color={colors.text} />
        </TouchableOpacity>
        {newPassword.length > 0 && (
          <Ionicons
            name={passwordValid ? "checkmark-circle" : "close-circle"}
            size={22}
            color={passwordValid ? "green" : "red"}
            style={{ marginLeft: 8 }}
          />
        )}
      </View>

      <Text style={styles.hint}>
        La contraseña debe tener 6-12 caracteres, una mayúscula y un símbolo especial.
      </Text>

      {/* Botón actualizar */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.text }]}
        onPress={handleChangePassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.background }]}>Actualizar contraseña</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10, marginHorizontal: 10 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: { flex: 1, paddingVertical: 10, fontFamily: "Jost_400Regular" },
  hint: { fontSize: 10, color: "#666", textAlign: "center", marginBottom: 10, fontFamily: "Jost_400Regular" },
  button: { padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontFamily: "Jost_600SemiBold", textTransform: "uppercase" },
});
