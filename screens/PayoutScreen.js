import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import CustomHeader from "../components/CustomHeader";

export default function PayoutScreen({ navigation }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const handlePay = () => {
    // Aquí luego conectas Stripe o el backend
    alert("✅ Pago procesado con éxito!");
    navigation.navigate("Success");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomHeader
        title='Datos de Pago:'
        showBack={true}
      />
      <View style={styles.infoContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre en la tarjeta</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Óscar Serna"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Número de tarjeta</Text>
          <TextInput
            style={styles.input}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={setCardNumber}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Expira</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/AA"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={expiry}
              onChangeText={setExpiry}
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="***"
              placeholderTextColor="#888"
              secureTextEntry
              keyboardType="numeric"
              value={cvv}
              onChangeText={setCvv}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payText}>Pagar Ahora</Text>
        </TouchableOpacity>
      </View>



    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,

  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: { marginBottom: 20 },
  label: { color: "#aaa", marginBottom: 6, fontSize: 14 },
  input: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  row: { flexDirection: "row" },
  payButton: {
    backgroundColor: "#8a6d0d",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  payText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  infoContainer: {
    padding: 20
  }
});
