import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import emailjs from "@emailjs/browser";
import PhoneInput from "react-native-phone-number-input";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PrivateMeeting() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const phoneInput = useRef(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [motivo, setMotivo] = useState("cumpleaños");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  const enviarFormulario = () => {
    if (!name || !phone || !email) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios.");
      return;
    }

    const templateParams = {
      name,
      telefono: phone,
      email,
      motivo,
      descripcion,
    };

    setLoading(true);
    emailjs
      .send(
        process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          setLoading(false);
          Alert.alert("Éxito", "Formulario enviado correctamente.");
          navigation.navigate("Confirmacion");
        },
        (error) => {
          setLoading(false);
          console.log(error.text);
          Alert.alert("Error", "Hubo un problema al enviar el formulario.");
        }
      );
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Reunión privada</Text>
      <Text
        style={{
          color: colors.text,
          fontFamily: "Jost_400Regular",
          marginBottom: 20,
          textAlign: "center",
          opacity: 0.8,
        }}
      >
        Introduce tus datos para solicitar tu reunión personalizada:
      </Text>

      {/* Nombre */}
      <TextInput
        placeholder="Nombre completo"
        value={name}
        onChangeText={setName}
        style={[styles.input, { borderColor: colors.text, color: colors.text }]}
        placeholderTextColor={colors.text}
      />

      {/* Teléfono */}
      <View
        style={[
          styles.phoneContainer,
          { borderColor: colors.text, borderWidth: 1, borderRadius: 8, paddingHorizontal: 5 },
        ]}
      >
        <PhoneInput
          ref={phoneInput}
          defaultCode="CO"
          layout="first"
          value={phone}
          onChangeFormattedText={(text) => setPhone(text)}
          containerStyle={{ backgroundColor: "transparent" }}
          textContainerStyle={{
            backgroundColor: "transparent",
            paddingVertical: 0,
          }}
          textInputStyle={{ color: colors.text, fontFamily: "Jost_400Regular" }}
        />
      </View>

      {/* Email */}
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[styles.input, { borderColor: colors.text, color: colors.text }]}
        placeholderTextColor={colors.text}
      />

      {/* Motivo */}
      <View
        style={[
          styles.pickerContainer,
          { borderColor: colors.text, borderWidth: 1, borderRadius: 8 },
        ]}
      >
        <Picker
          selectedValue={motivo}
          dropdownIconColor={colors.text}
          onValueChange={(itemValue) => setMotivo(itemValue)}
          style={{ color: colors.text }}
        >
          <Picker.Item label="Cumpleaños" value="cumpleaños" />
          <Picker.Item label="Conmemoración" value="conmemoración" />
          <Picker.Item label="Otro" value="otro" />
        </Picker>
      </View>

      {/* Descripción */}
      <TextInput
        placeholder="Danos una breve descripción de tu requerimiento..."
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        style={[
          styles.textarea,
          { borderColor: colors.text, color: colors.text, textAlignVertical: "top" },
        ]}
        placeholderTextColor={colors.text}
      />

      {/* Botón */}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: loading ? "#999" : colors.text },
        ]}
        onPress={enviarFormulario}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text
            style={{
              color: colors.background,
              textAlign: "center",
              fontFamily: "Jost_600SemiBold",
              textTransform: "uppercase",
            }}
          >
            Enviar
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Jost_600SemiBold",
    marginBottom: 15,
    textAlign: "center",
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontFamily: "Jost_400Regular",
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 100,
    marginBottom: 20,
    fontFamily: "Jost_400Regular",
  },
  phoneContainer: {
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  button: {
    padding: 15,
    borderRadius: 8,
  },
};
