import React, { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import Modal from "react-native-modal";
import { useTheme } from "@react-navigation/native";
import PassInput from "./PassInput";

const ConfirmDeleteModal = ({ isVisible, onClose, onConfirm }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleConfirm = async () => {
    if (!password) return;
    setLoading(true);
    await onConfirm(password); // ✅ ahora recibe password en el padre
    setLoading(false);
    setPassword("");
    onClose(); // ✅ cierra el modal tras confirmar
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
        <Text style={{ fontSize: 20, fontFamily: "Jost_700Bold", color: "#B22222", textAlign: "center" }}>
          Eliminar cuenta
        </Text>

        <Text style={{ color: colors.text, textAlign: "center", marginVertical: 10, fontFamily: "Jost_400Regular" }}>
          Esta acción eliminará permanentemente tu cuenta y todos tus datos personales. Escribe tu contraseña para confirmar.
        </Text>

        <PassInput password={password} setPassword={setPassword} />

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
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
            <Text style={{ color: "#333", textAlign: "center", fontFamily: "Jost_700Bold" }}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleConfirm}
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: "#B22222",
              padding: 12,
              borderRadius: 10,
              marginLeft: 8,
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontFamily: "Jost_700Bold" }}>
              {loading ? "Eliminando..." : "Eliminar"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ConfirmDeleteModal;
