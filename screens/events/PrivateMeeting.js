import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import emailjs from "@emailjs/browser";
import PhoneInput from "react-native-phone-number-input";
import { Picker } from "@react-native-picker/picker";
import CustomHeader from "../../components/CustomHeader";
import ButtonGeneral from "../../components/ButtonGeneral";
import { MotiView } from "moti"; // 👈 importamos Moti
import Toast from "react-native-toast-message";

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
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Por favor completa todos los campos obligatorios.",
      });
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
        () => {
          setLoading(false);
          Toast.show({
            type: "success",
            text1: "Éxito",
            text2: "Formulario enviado correctamente.",
          })
          navigation.navigate("Confirmacion");
        },
        (error) => {
          setLoading(false);
          console.log(error.text);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Hubo un problema al enviar el formulario.",
          });
        }
      );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 600 }}
      >
        <CustomHeader title="reunión privada" />
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 15 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 700, delay: 150 }}
      >
        <Text
          style={{
            color: colors.text,
            fontFamily: "Jost_400Regular",
            marginVertical: 10,
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          Introduce tus datos para solicitar tu reunión personalizada:
        </Text>
      </MotiView>

      <ScrollView contentContainerStyle={{ marginTop: 10 }}>
        {[
          // 👉 Lista de campos con delays progresivos
          {
            key: "name",
            component: (
              <TextInput
                placeholder="Nombre completo"
                value={name}
                onChangeText={setName}
                style={[
                  styles.input,
                  { borderColor: colors.text, color: colors.text },
                ]}
                placeholderTextColor={colors.text}
              />
            ),
          },
          {
            key: "phone",
            component: (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.text,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 8,
                  marginBottom: 15,
                }}
              >
                <PhoneInput
                  ref={phoneInput}
                  defaultCode="CO"
                  layout="first"
                  value={phone}
                  onChangeFormattedText={(text) => setPhone(text)}
                  containerStyle={{
                    backgroundColor: "transparent",
                    width: "100%",
                    borderRadius: 10,
                  }}
                  textContainerStyle={{
                    backgroundColor: "transparent",
                    paddingVertical: 10,
                    borderRadius: 8,
                  }}
                  codeTextStyle={{
                    color: colors.text,
                    fontFamily: "Jost_400Regular",
                  }}
                  textInputStyle={{
                    color: colors.text,
                    fontFamily: "Jost_400Regular",
                    fontSize: 15,
                    marginLeft: 8,
                  }}
                  flagButtonStyle={{
                    marginRight: 5,
                  }}
                  placeholder="Número de móvil"
                  placeholderTextColor={colors.text}
                />
              </View>
            ),
          },
          {
            key: "email",
            component: (
              <TextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.input,
                  { borderColor: colors.text, color: colors.text },
                ]}
                placeholderTextColor={colors.text}
              />
            ),
          },
          {
            key: "motivo",
            component: (
              <View
                style={[
                  styles.pickerContainer,
                  {
                    borderColor: colors.text,
                    borderWidth: 1,
                    borderRadius: 10,
                  },
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
            ),
          },
          {
            key: "descripcion",
            component: (
              <TextInput
                placeholder="Danos una breve descripción de tu requerimiento..."
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                style={[
                  styles.textarea,
                  {
                    borderColor: colors.text,
                    color: colors.text,
                    textAlignVertical: "top",
                  },
                ]}
                placeholderTextColor={colors.text}
              />
            ),
          },
        ].map((field, i) => (
          <MotiView
            key={field.key}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "timing",
              duration: 600,
              delay: 200 + i * 150, // ⏱️ efecto cascada
            }}
          >
            {field.component}
          </MotiView>
        ))}

        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", delay: 1000, damping: 15 }}
        >
          <ButtonGeneral
            bckColor={colors.text}
            textColor={colors.background}
            text={loading ? "Enviando..." : "Enviar"}
            onPress={enviarFormulario}
          />
        </MotiView>
      </ScrollView>
    </View>
  );
}

const styles = {
  container: {
    paddingBottom: 40,
    justifyContent: "center",
    marginHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontFamily: "Jost_400Regular",
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 100,
    fontFamily: "Jost_400Regular",
  },
  pickerContainer: {
    marginBottom: 10,
  },
};
