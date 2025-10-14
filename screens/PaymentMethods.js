import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { auth } from "../config/firebase";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";
import { initPaymentSheet, presentPaymentSheet } from "@stripe/stripe-react-native";
import { LinearGradient } from 'expo-linear-gradient';



const PaymentMethods = () => {
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const { colors } = useTheme();

  // 🔹 Cargar métodos de pago del usuario al montar
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      setLoading(true);
      const res = await fetch(
        "https://us-central1-chris-rosas-web.cloudfunctions.net/api/listPaymentMethods",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid, email: user.email }),
        }
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setPaymentMethods(data);
      } else {
        console.log("Respuesta inesperada:", data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    setLoading(true);
    const user = auth.currentUser;
    if (!user) return Alert.alert("Error", "Debes iniciar sesión");

    try {
      // 1️⃣ Crear SetupIntent
      const res = await fetch(
        "https://us-central1-chris-rosas-web.cloudfunctions.net/api/createSetupIntent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid, email: user.email }),
        }
      );
      const { client_secret } = await res.json();
      if (!client_secret)
        return Alert.alert("Error", "No se pudo generar SetupIntent");

      // 2️⃣ Inicializar PaymentSheet
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

      // 3️⃣ Mostrar PaymentSheet
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        Alert.alert("Error", presentError.message);
      } else {
        Alert.alert("✅ Método de pago agregado", "Tu método de pago se vinculó correctamente");
        fetchPaymentMethods(); // 🔁 Actualizar lista tras añadir
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "No se pudo vincular el método de pago");
    } finally {
      setLoading(false);
    }
  };

  const renderCardItem = ({ item }) => (

    <LinearGradient
      colors={['#e4c86dff', '#998030ff', '#e4c86dff', '#998030ff']} // Tonos dorados
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.cardItem, {
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        height: 200
      }]}
    >
      <View style={styles.infoCard}>
        <FontAwesome5
          name={
            item.card.brand === "visa"
              ? "cc-visa"
              : item.card.brand === "mastercard"
                ? "cc-mastercard"
                : "credit-card"
          }
          size={40}

        />
        <Text style={[styles.cardText]}>
          **** **** **** {item.card.last4}{" "}

        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveMethod(item.id)}
        style={{ padding: 10, backgroundColor: '#3131316b', borderRadius: 22 }}
      >
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </LinearGradient>
  );

  const handleRemoveMethod = async (paymentMethodId) => {
    try {
      const res = await fetch(
        "https://us-central1-chris-rosas-web.cloudfunctions.net/api/detachPaymentMethod",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentMethodId }),
        }
      );
      const data = await res.json();
      if (data.id) {
        Alert.alert("Método eliminado", "Se ha eliminado correctamente");
        fetchPaymentMethods();
      } else {
        Alert.alert("Error", "No se pudo eliminar el método de pago");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "No se pudo eliminar el método de pago");
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

       

        {/* 🔹 Lista de métodos de pago existentes */}
        {paymentMethods.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.subtitle, { color: colors.text }]}>Tus Tarjetas:</Text>
            <FlatList
              data={paymentMethods}
              keyExtractor={(item) => item.id}
              renderItem={renderCardItem}
              scrollEnabled={false}
            />
          </View>
        )}
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '90%'
  },
  cardItem: {
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#997528ff",
    padding: 12,
    height: 100,
    borderRadius: 8,
    marginVertical: 4,
  },
  cardText: { fontSize: 20, fontFamily: "Jost_400Regular" },
});

export default PaymentMethods;
