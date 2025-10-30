import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useTheme } from "@react-navigation/native";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const { colors } = useTheme();

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor ingresa tu correo");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Éxito", "Revisa tu correo para restablecer la contraseña");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: colors.text}]}>Recuperar contraseña</Text>
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { borderColor: colors.text, color: colors.text }]}
        placeholderTextColor={colors.text}
      />
      <TouchableOpacity style={[styles.button,{backgroundColor: colors.text}]} onPress={handleReset}>
        <Text style={[styles.buttonText, {color:colors.background}]}>Enviar enlace</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start", padding: 20, marginTop: 160},
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: "tomato", padding: 15, borderRadius: 8 },
  buttonText: { textAlign: "center", fontWeight: "bold" },
});
