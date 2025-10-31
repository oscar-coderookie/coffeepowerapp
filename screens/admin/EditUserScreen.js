import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useTheme, useRoute, useNavigation } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import CustomHeader from "../../components/CustomHeader";

export default function EditUserScreen() {
  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = route.params;

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone?.numero || "");

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", user.id), {
        name,
        email,
        phone: { numero: phone },
      });
      Alert.alert("✅ Datos actualizados");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Error al actualizar datos");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Editar usuario" showBack />
      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.text }]}>Nombre</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nombre"
          placeholderTextColor={colors.border}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />

        <Text style={[styles.label, { color: colors.text }]}>Correo</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Correo"
          placeholderTextColor={colors.border}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />

        <Text style={[styles.label, { color: colors.text }]}>Teléfono</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Teléfono"
          keyboardType="phone-pad"
          placeholderTextColor={colors.border}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 16 },
  label: { marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  saveBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700" },
});
