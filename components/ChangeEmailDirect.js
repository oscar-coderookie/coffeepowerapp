import { View, TextInput, Alert } from "react-native";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ButtonGeneral from "./ButtonGeneral";
import { useTheme } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const ChangeEmailDirect = ({ currentEmail, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const { colors } = useTheme();

  const handleChangeEmail = async () => {
    if (!newEmail || !confirmEmail) {
      Alert.alert("Error", "Debes completar ambos campos");
      return;
    }
    if (newEmail !== confirmEmail) {
      Alert.alert("Error", "Los correos no coinciden");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { email: newEmail }); // solo actualiza Firestore
      Alert.alert("Éxito", "Correo de notificaciones actualizado");
      onSuccess(); // cerrar formulario
    } catch (error) {
      console.error("Error al actualizar correo:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ margin: 10 }}>
      {/* Correo actual (solo lectura) */}
      <TextInput
        placeholder="Correo actual"
        value={currentEmail}
        editable={false}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          marginBottom: 10,
          backgroundColor: "#f0f0f0",
          color: "#555",
        }}
      />

      {/* Nuevo correo */}
      <TextInput
        placeholder="Nuevo correo"
        value={newEmail}
        onChangeText={setNewEmail}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          marginBottom: 10,
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Confirmar correo */}
      <TextInput
        placeholder="Confirma el nuevo correo"
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          marginBottom: 10,
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <ButtonGeneral
        text="Actualizar correo"
        bckColor={colors.text}
        textColor={colors.background}
        onTouch={handleChangeEmail}
      />
    </View>
  );
};

export default ChangeEmailDirect;
