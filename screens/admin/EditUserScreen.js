import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme, useRoute, useNavigation } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import CustomHeader from "../../components/CustomHeader";
import { playSound } from "../../utils/soundPlayer";
import ButtonGeneral from "../../components/ButtonGeneral";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";

export default function EditUserScreen() {
  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = route.params;

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone?.numero || "");

    // Eliminar usuario
    const handleDeleteUser = (userId) => {
      playSound('click')
      Alert.alert("Confirmar eliminación", "¿Seguro que quieres eliminar este usuario?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "users", userId));
              Toast.show({
                type: "success",
                text1: "Eliminación Exitosa",
                text2: "Usuario eliminado correctamente ✅",
              });
            } catch (error) {
              console.error("Error al eliminar usuario:", error);
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo eliminar el usuario ❌",
              })
            }
          },
        },
      ]);
    };

  const handleSave = async () => {
    playSound('click')
    try {
      await updateDoc(doc(db, "users", user.id), {
        name,
        email,
        phone: { numero: phone },
      });
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "✅ Datos actualizados exitosamente.",
      });
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "❌ Error al actualizar datos",
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title={`Editar: ${user.name}`} showBack />
      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.text }]}>Nombre completo:</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nombre"
          placeholderTextColor={colors.border}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />

        <Text style={[styles.label, { color: colors.text }]}>Correo electrónico:</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Correo"
          placeholderTextColor={colors.border}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />

        <Text style={[styles.label, { color: colors.text }]}>Móvil:</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Teléfono"
          keyboardType="phone-pad"
          placeholderTextColor={colors.border}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />


        <ButtonGeneral
          bckColor={["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"]}
          text="actualizar datos"
          textColor="white"
          onTouch={handleSave}

          borderColors={["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"]}
          soundType="click"

        />
        <TouchableOpacity
          onPress={() => handleDeleteUser(user.id)}
          style={{
            padding: 14,
            borderRadius: 10,
            backgroundColor: "red",
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center'
          }}
        >
          <MaterialIcons name="delete" size={24} color={colors.background} />
          <Text style={{fontFamily:'Jost_600SemiBold', color:colors.background, textTransform:'uppercase', width:'40%'}}>Eliminar Usuario</Text>

        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { marginHorizontal: 10, paddingTop: 20 },
  label: {
    marginBottom: 6,
    fontFamily: 'Jost_600SemiBold',
    textTransform: 'uppercase',
    marginLeft: 4
  },
  input: {
    fontFamily: "Jost_400Regular",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700" },
});
