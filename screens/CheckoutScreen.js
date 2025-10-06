// screens/CheckoutScreen.js
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import CustomHeader from "../components/CustomHeader";
import { useTheme } from "@react-navigation/native";

export default function CheckoutScreen({ navigation }) {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");


  const handlePayout = () => {
    navigation.navigate('Payout')
  }
  // ✅ Condición: todos los campos deben estar llenos
  const isFormValid =
    name.trim() !== "" &&
    address.trim() !== "" &&
    phone.trim() !== "" &&
    email.trim() !== "";


  return (
    <View style={styles.container}>
      <CustomHeader
        title='Datos de Envío'
       showBack={true}
      />
      <View style={styles.form}>
        <Text style={{
          fontSize: 16,
          marginBottom: 20,
          color: colors.text,
          fontFamily: 'Jost_400Regular',
        }}>Introduce los datos para tu pedido:</Text>
        <TextInput
          style={{
            backgroundColor: colors.input,
            padding: 15,
            borderRadius: 10,
            color: colors.text,
            fontSize: 16,
            borderWidth: 1,
            borderColor: colors.input,
            marginTop: 10,
            marginBottom: 10,
                 fontFamily: 'Jost_400Regular'
          }}
          placeholder="Nombre completo"
          value={name}
          placeholderTextColor={colors.text}
          onChangeText={setName}
        />

        <TextInput
          style={{
            backgroundColor: colors.input,
            padding: 15,
            borderRadius: 10,
            color: colors.text,
            fontSize: 16,
            borderWidth: 1,
            borderColor: colors.input,
            marginTop: 10,
            marginBottom: 10,
                 fontFamily: 'Jost_400Regular'
          }}
          placeholder="Dirección de entrega"
          value={address}
          placeholderTextColor={colors.text}
          onChangeText={setAddress}
        />

        <TextInput
          style={{
            backgroundColor: colors.input,
            padding: 15,
            borderRadius: 10,
            color: colors.text,
            fontSize: 16,
            borderWidth: 1,
            borderColor: colors.input,
            marginTop: 10,
            marginBottom: 10,
                 fontFamily: 'Jost_400Regular'
          }}
          placeholder="Detalles adicionales (Apto, piso, referencias...)"
          placeholderTextColor={colors.text}
          value={details}
          onChangeText={setDetails}
        />

        <TextInput
          style={{
            backgroundColor: colors.input,
            padding: 15,
            borderRadius: 10,
            color: colors.text,
            fontSize: 16,
            borderWidth: 1,
            borderColor: colors.input,
            marginTop: 10,
            marginBottom: 10,
                 fontFamily: 'Jost_400Regular'
          }}
          placeholder="Teléfono"
          placeholderTextColor={colors.text}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={{
            backgroundColor: colors.input,
            padding: 15,
            borderRadius: 10,
            color: colors.text,
            fontSize: 16,
            borderWidth: 1,
            borderColor: colors.input,
            marginTop: 10,
            marginBottom: 10,
                 fontFamily: 'Jost_400Regular'
          }}
          placeholderTextColor={colors.text}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

      </View>
      <TouchableOpacity
        onPress={handlePayout}
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Continuar al Pago</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8a6d0dff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,

  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textTransform: 'uppercase',
    fontFamily: 'Jost_600SemiBold'

  },
  form: {
    paddingTop: 40,
    padding: 20,

  }
});
