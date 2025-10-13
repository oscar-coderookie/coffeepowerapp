import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { auth } from "../config/firebase";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";
import { initPaymentSheet, presentPaymentSheet } from "@stripe/stripe-react-native";

const PaymentMethods = () => {
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleAddPaymentMethod = async () => {
    setLoading(true);
    const user = auth.currentUser;
    if (!user) return Alert.alert("Error", "Debes iniciar sesión");

    try {
      // 1️⃣ Llamar a tu backend para crear SetupIntent
      const res = await fetch(
        "https://us-central1-chris-rosas-web.cloudfunctions.net/createSetupIntent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        }
      );

      const { client_secret } = await res.json();
      if (!client_secret)
        return Alert.alert("Error", "No se pudo generar SetupIntent");

      // 2️⃣ Inicializar PaymentSheet con Google Pay y Apple Pay habilitados
      const { error: initError } = await initPaymentSheet({
        setupIntentClientSecret: client_secret,
        merchantDisplayName: "Coffee Power",
        googlePay: true,
        applePay: true,
      });

      if (initError) {
        console.log("Init PaymentSheet error:", initError);
        return Alert.alert("Error", initError.message);
      }

      // 3️⃣ Mostrar PaymentSheet al usuario
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        Alert.alert("Error", presentError.message);
      } else {
        Alert.alert("✅ Método de pago agregado", "Tu método de pago se vinculó correctamente");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "No se pudo vincular el método de pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Métodos de pago:" />
      <View style={{ marginHorizontal: 10 }}>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Aquí puedes añadir y modificar tus métodos de pago:
        </Text>

        {loading && <ActivityIndicator size="large" color={colors.text} />}

        <TouchableOpacity
          style={[styles.gpayButton, { backgroundColor: colors.text }]}
          onPress={handleAddPaymentMethod}
        >
          <Text style={{ color: colors.background, fontSize: 26, marginRight: 10 }}>+</Text>
          <FontAwesome5 name="google-pay" size={30} color={colors.background} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.gpayButton, { backgroundColor: colors.text }]}
          onPress={handleAddPaymentMethod}
        >
          <Text style={{ color: colors.background, fontSize: 26, marginRight: 10 }}>+</Text>
          <FontAwesome5 name="apple-pay" size={30} color={colors.background} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.gpayButton, { backgroundColor: colors.text }]}
          onPress={handleAddPaymentMethod}
        >
          <Text style={{ color: colors.background, fontSize: 26, marginRight: 10 }}>+</Text>
          <FontAwesome5 name="credit-card" size={30} color={colors.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, marginBottom: 20 },
  subtitle: { fontFamily: "Jost_400Regular", marginVertical: 16, textAlign: "center" },
  gpayButton: {
    backgroundColor: "#000",
    borderRadius: 10,
    justifyContent: "center",
    paddingVertical: 12,
    marginVertical: 6,
    alignItems: "center",
    flexDirection: "row",
  },
});

export default PaymentMethods;
