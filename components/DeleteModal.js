import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import Modal from "react-native-modal";
import { useDeleteAccount } from "../utils/deleteAccount";

const ConfirmDeleteModal = ({ isVisible, onClose }) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading] = useState(false);
    const { deleteAccount } = useDeleteAccount(); // 👈 aquí usamos el hook


  const handleDelete = async () => {
    if (confirmationText.trim().toUpperCase() !== "ELIMINAR") {
      alert('Debes escribir "ELIMINAR" para confirmar.');
      return;
    }

    setLoading(true);
    try {
      await deleteAccount();
      onClose();
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
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#B22222", textAlign: "center" }}>
          Eliminar cuenta
        </Text>
        <Text style={{ color: "#555", textAlign: "center", marginVertical: 10 }}>
          Esta acción eliminará permanentemente tu cuenta y todos tus datos personales.
          Si estás seguro, escribe <Text style={{ fontWeight: "bold" }}>ELIMINAR</Text> para confirmar.
        </Text>

        <TextInput
          placeholder="Escribe ELIMINAR"
          value={confirmationText}
          onChangeText={setConfirmationText}
          autoCapitalize="characters"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            textAlign: "center",
            fontWeight: "bold",
            marginVertical: 10,
          }}
        />

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
            <Text style={{ color: "#333", textAlign: "center", fontWeight: "bold" }}>Cancelar</Text>
          </TouchableOpacity>

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
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
              {loading ? "Eliminando..." : "Eliminar"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ConfirmDeleteModal;
