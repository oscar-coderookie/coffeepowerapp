import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import emailjs from "@emailjs/browser";


const PrivateMeeting = () => {
  const navigation = useNavigation();
  const phoneInput = useRef(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [motivo, setMotivo] = useState("cumpleaños");
  const [descripcion, setDescripcion] = useState("");

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

    emailjs
      .send(
        process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID, // cambia REACT_APP por EXPO_PUBLIC
        process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log(result.text);
          Alert.alert("Éxito", "Formulario enviado correctamente.");
          navigation.navigate("Confirmacion"); // ajusta con el nombre real de tu screen
        },
        (error) => {
          console.log(error.text);
          Alert.alert("Error", "Hubo un problema al enviar el formulario.");
        }
      );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.title}>Reunión privada:</Text>
      <Text style={styles.text}>
        Introduce tus datos en el siguiente formulario para poder atender tu
        solicitud por favor:
      </Text>

      <Text style={styles.label}>Nombre Completo:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Tu nombre completo"
      />

      <Text style={styles.label}>Móvil:</Text>
      <PhoneInput
        ref={phoneInput}
        defaultCode="CO"
        layout="first"
        value={phone}
        onChangeFormattedText={(text) => setPhone(text)}
        containerStyle={styles.phoneContainer}
        textContainerStyle={styles.phoneTextContainer}
      />

      <Text style={styles.label}>Correo Electrónico:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="correo@ejemplo.com"
      />

      <Text style={styles.label}>Motivo de la Reunión:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={motivo}
          onValueChange={(itemValue) => setMotivo(itemValue)}
        >
          <Picker.Item label="Cumpleaños" value="cumpleaños" />
          <Picker.Item label="Conmemoración" value="conmemoración" />
          <Picker.Item label="Otro" value="otro" />
        </Picker>
      </View>

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        placeholder="Danos una leve descripción de tu requerimiento."
      />

      <TouchableOpacity style={styles.button} onPress={enviarFormulario}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};

export default PrivateMeeting;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent:'center',
    paddingBottom: 40,
    backgroundColor:'#ffffffff'
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  phoneContainer: {
    width: "100%",
    height: 50,
    marginTop: 6,
    marginBottom: 10,
  },
  phoneTextContainer: {
    borderRadius: 8,
    paddingVertical: 0,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#c59d5f",
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
