import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/CustomHeader";
import ButtonGeneral from "../../components/ButtonGeneral";
import Toast from "react-native-toast-message";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const { colors } = useTheme();

  const handleReset = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Por favor ingresa tu correo",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Revisa tu correo para restablecer la contraseña",
      })
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="recuperar contraseña" showBack />
      <View style={{ marginHorizontal: 10, marginTop: 20 }}>
        <Text style={{ fontFamily: 'Jost_400Regular', marginBottom: 10, textAlign: 'justify' }}>Aqui podras restablecer tu contraseña en caso de olvido, introduce el correo registrado en la app; y te enviaremos un enlace para reestablecer la contraseña:</Text>
        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { borderColor: colors.text, color: colors.text }]}
          placeholderTextColor={colors.text}
        />

        <ButtonGeneral
          text="Enviar enlace"
          onTouch={handleReset}
          textColor="white"
          bckColor={["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"]}
          borderColors={["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"]} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: { borderWidth: 1, padding: 10, borderRadius: 120, marginBottom: 15, fontFamily: 'Jost_400Regular' },
});
