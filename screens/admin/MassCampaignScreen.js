import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useTheme } from "@react-navigation/native";
import ButtonGeneral from "../../components/ButtonGeneral";
import RNPickerSelect from "react-native-picker-select";
import Toast from "react-native-toast-message";

const MassCampaignsScreen = () => {
  const { colors } = useTheme();
  const [messageTitle, setMessageTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [type, setType] = useState("info"); // default

const handleSend = async () => {
  if (!messageTitle.trim() || !messageBody.trim()) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  const uid = auth.currentUser?.uid;
  if (!uid) {
    alert("No hay usuario autenticado.");
    return;
  }

  try {
    // 1️⃣ Guardamos el mensaje en la colección "messages" global (opcional)
    const messageRef = doc(collection(db, "messages"));
    await setDoc(messageRef, {
      title: messageTitle,
      body: messageBody,
      type,
      createdAt: new Date(),
    });

    // 2️⃣ Llamamos a la Cloud Function para replicar el mensaje a cada usuario
    const response = await fetch(
      "https://us-central1-chris-rosas-web.cloudfunctions.net/replicateMassMessage",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: { title: messageTitle, body: messageBody, type }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error en la función:", errorText);
      Toast.show({
        type: "error",
        text1: "Error al enviar mensaje",
        text2: "La función no respondió correctamente",
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Mensaje masivo enviado",
      text2: "El mensaje ha sido replicado a todos los usuarios",
    });

    setMessageTitle("");
    setMessageBody("");
    setType("info");

  } catch (error) {
    console.error("❌ Error handleSend:", error);
    Toast.show({
      type: "error",
      text1: "Error al enviar mensaje",
      text2: "Revisa la consola para más detalles",
    });
  }
};



  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>Título del mensaje</Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholderTextColor={colors.text}
        value={messageTitle}
        onChangeText={setMessageTitle}
        placeholder="Escribe un título..."
      />

      <Text style={[styles.label, { color: colors.text }]}>Contenido del mensaje</Text>
      <TextInput
        style={[styles.input, styles.textArea, { color: colors.text, borderColor: colors.border }]}
        value={messageBody}
        placeholderTextColor={colors.text}
        onChangeText={setMessageBody}
        placeholder="Escribe el mensaje..."
        multiline
      />

      <Text style={[styles.label, { color: colors.text }]}>Tipo de mensaje</Text>

      <View style={[styles.pickerWrapper, { borderColor: colors.border, }]} >
        <RNPickerSelect
          onValueChange={(value) => setType(value)}
          value={type}
          placeholder={{
            label: "Selecciona un tipo de mensaje...",
            value: null,
            color: colors.text + "99",
          }}
          items={[
            { label: "Información", value: "info" },
            { label: "Advertencia", value: "warning" },
            { label: "Error", value: "error" },
            { label: "Éxito", value: "success" },
            { label: "Promoción", value: "promo" },
            { label: "Cupón", value: "coupon" },
          ]}
          style={{
            inputIOS: {
              color: colors.text,
              fontSize: 16,
              fontFamily: "Jost_400Regular",
              paddingVertical: 12,
              paddingHorizontal: 10,
            },
            inputAndroid: {
              color: colors.text,
              fontSize: 16,
              fontFamily: "Jost_400Regular",
              paddingVertical: 8,
              paddingHorizontal: 10,
            },
            placeholder: {
              color: colors.text + "99",
              fontFamily: "Jost_400Regular",
            },
            iconContainer: {
              top: 12,
              right: 12,
            },
          }}
          useNativeAndroidPickerStyle={false}
          Icon={() => (
            <Text style={{ color: colors.text, fontSize: 16 }}>▼</Text>
          )}
        />
      </View>
      <ButtonGeneral
        text="Enviar difusión masiva"
        textColor="white"
        bckColor={["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"]}
        borderColors={["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"]}
        onTouch={handleSend}
        soundType="click"
      />
    </ScrollView>
  );
};

export default MassCampaignsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontFamily: 'Jost_600SemiBold'
  },
  input: {
    borderWidth: 1,
    fontFamily: 'Jost_400Regular',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  textArea: {
    height: 140,
    textAlignVertical: "top",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 25,
  },
  button: {

    padding: 16,
    borderRadius: 10,
  },
  buttonText: {

    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
});
