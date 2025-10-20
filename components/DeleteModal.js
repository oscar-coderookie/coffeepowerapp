import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";
import Modal from "react-native-modal";
import { useTheme } from "@react-navigation/native";
import { auth, db } from "../config/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import PassInput from "./PassInput";

const ConfirmDeleteModal = ({ isVisible, onClose }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleDelete = async () => {
    if (!password) {
      Alert.alert("Error", "Ingresa tu contraseña para confirmar.");
      return;
    }

    setLoading(true);
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No hay usuario autenticado.");
      setLoading(false);
      return;
    }

    try {
      // 🔹 1. Reautenticación
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // 🔹 2. Eliminar documento de Firestore
      const userRef = doc(db, "users", user.uid);
      await deleteDoc(userRef);

      // 🔹 3. Eliminar cuenta del Auth
      await deleteUser(user);

      Alert.alert("Cuenta eliminada", "Tu cuenta ha sido borrada exitosamente.");
      onClose(); // cerrar modal
    } catch (error) {
      console.error("Error eliminando cuenta:", error);
      if (error.code === "auth/wrong-password") {
        Alert.alert("Contraseña incorrecta", "La contraseña ingresada no es válida.");
      } else if (error.code === "auth/requires-recent-login") {
        Alert.alert("Inicio de sesión requerido", "Vuelve a iniciar sesión antes de eliminar tu cuenta.");
      } else {
        Alert.alert("Error", "No se pudo eliminar la cuenta.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      avoidKeyboard
      style={{ justifyContent: "flex-end", margin: 0 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 20, fontFamily: 'Jost_700Bold', color: "#B22222", textAlign: "center" }}>
          Eliminar cuenta
        </Text>

        <Text style={{ color: colors.text, textAlign: "center", marginVertical: 10, fontFamily: 'Jost_400Regular' }}>
          Esta acción eliminará permanentemente tu cuenta y todos tus datos personales. Escribe tu contraseña para confirmar.
        </Text>

        <PassInput password={password} setPassword={setPassword}/>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
          {/* Cancelar */}
          <TouchableOpacity
            onPress={onClose}
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: "#ccc",
              padding: 12,
              borderRadius: 10,
              marginRight: 8,
            }}
          >
            <Text style={{ color: "#333", textAlign: "center", fontFamily: 'Jost_700Bold' }}>Cancelar</Text>
          </TouchableOpacity>

          {/* Eliminar */}
          <TouchableOpacity
            onPress={handleDelete}
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: "#B22222",
              padding: 12,
              borderRadius: 10,
              marginLeft: 8,
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontFamily: 'Jost_700Bold' }}>
              {loading ? "Eliminando..." : "Eliminar"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ConfirmDeleteModal;
