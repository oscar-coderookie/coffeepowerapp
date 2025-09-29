// screens/CheckoutScreen.js
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import CustomHeader from "../components/CustomHeader";
import CountryPicker from "react-native-country-picker-modal";

export default function CheckoutScreen({ navigation }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("CO");
  const [country, setCountry] = useState(null);

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
        onBack={() => navigation.goBack()}
      />
      <View style={styles.form}>
        <Text style={styles.text}>Introduce los datos para tu pedido:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={name}
          placeholderTextColor="#aaa"
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Dirección de entrega"
          value={address}
          placeholderTextColor="#aaa"
          onChangeText={setAddress}
        />

        <TextInput
          style={styles.input}
          placeholder="Detalles adicionales (Apto, piso, referencias...)"
          placeholderTextColor="#aaa"
          value={details}
          onChangeText={setDetails}
        />

        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholderTextColor="#aaa"
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* <CountryPicker
        withFlag
        withFilter
        withCallingCode
        withCountryNameButton
        countryCode={countryCode}
        onSelect={(country) => {
          setCountryCode(country.cca2);
          setCountry(country);
        }}
      />
      {country && (
        <Text style={styles.selected}>
          {country.name} ({country.callingCode[0]})
        </Text>
      )} */}

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
    justifyContent:'space-between',
    marginBottom:20,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    color: "#fff",
    fontFamily: 'Jost_400Regular',
  },
  input: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 10,
    marginBottom: 10
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
