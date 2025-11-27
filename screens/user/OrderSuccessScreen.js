import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CustomHeader from "../../components/CustomHeader";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import LoadingScreen from "../../components/LoadingScreen";

export default function OrderSuccessScreen({ navigation, route }) {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId, userId } = route.params;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const ref = doc(db, "users", userId, "orders", orderId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setOrderData(snap.data());
        } else {
          console.warn("Orden no encontrada");
        }
      } catch (err) {
        console.error("Error obteniendo la orden:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);


  const handleGoHome = () => {
    navigation.navigate("UserStack", { screen: "UserArea" });
  };

  const handleGoToOrders = () => {
    navigation.navigate("MyOrders");
  };



  return (
    <View>
      <CustomHeader title="resumen de compra" showBack />
      <View style={styles.container}>
        {/* TITLE */}
        <Text style={styles.title}>¡Compra completada!</Text>

        {/* CHECK ICON */}
        <Text style={styles.bigCheck}>✔️</Text>

        {/* ORDER ID */}
        <Text style={styles.orderId}>
          Número de orden:
          {" "}
          <Text style={styles.bold}>{orderId}</Text>
        </Text>
        <Text>{orderData.paymentMethod}</Text>
        {/* SHORT SUMMARY */}
 <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resumen del pedido</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Método de pago:</Text>
            <Text style={styles.value}>{orderData.paymentMethod}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Entrega:</Text>
            <Text style={styles.value}>{orderData.shippingMethod}</Text>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Productos</Text>

          {orderData.products.map((p, index) => (
            <View key={index} style={styles.productRow}>
              <Text style={styles.productName}>
                {p.name} × {p.quantity}
              </Text>
              <Text style={styles.productSubtotal}>{p.subtotal.toFixed(2)} €</Text>
            </View>
          ))}
        </View> 


        {/* BUTTONS */}
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleGoToOrders}>
          <Text style={styles.buttonText}>Ver mis pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={handleGoHome}>
          <Text style={styles.buttonSecondaryText}>Volver al inicio</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {

    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  bigCheck: {
    fontSize: 60,
    marginVertical: 20,
  },
  orderId: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#444",
  },
  bold: { fontWeight: "700" },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20
  },
  sectionTitle: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  label: {
    fontFamily: "Jost_500Medium",
    fontSize: 15,
    color: "#555",
  },
  value: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 15,
    color: "#111",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  productName: {
    fontFamily: "Jost_400Regular",
    color: "#555",
    fontSize: 14,
  },
  productSubtotal: {
    fontFamily: "Jost_600SemiBold",
    color: "#000",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  item: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },

  buttonPrimary: {
    width: "100%",
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  buttonSecondary: {
    padding: 14,
  },
  buttonSecondaryText: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
});
