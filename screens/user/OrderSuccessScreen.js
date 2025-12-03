import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import CustomHeader from "../../components/CustomHeader";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import LoadingScreen from "../../components/LoadingScreen";
import ButtonGeneral from "../../components/ButtonGeneral";
import cartIcon from '../../assets/images/cart.png'

export default function OrderSuccessScreen({ navigation, route }) {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId, userId, orderNumber } = route.params;

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
  
    navigation.navigate("Cart");
  };

  const handleGoToOrders = () => {
      navigation.navigate("Área personal", { screen: "UserArea" });
  };

  if (loading) {
    return (<LoadingScreen />)
  }

  return (
    <View>
      <CustomHeader title="resumen de compra" />
      <View style={styles.container} >
        {/* TITLE */}
        <Text style={styles.title}>¡Compra completada!</Text>
        {/* ORDER ID */}
        <Text style={{ fontFamily: 'Jost_400Regular', fontSize: 18, textAlign: 'center' }}>Tu café ya va en camino..</Text>
        <Image source={cartIcon} style={{ width: 250, height: 200 }} resizeMode="contain" />
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.orderId}>
            Número de orden:
          </Text>
          <Text style={styles.bold}> {orderNumber}</Text>
        </View>

        {/* BUTTONS */}
        <ButtonGeneral
          text="IR A TUS PEDIDOS"
          textColor="white"
          bckColor={["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"]}
          borderColors={["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"]}
          onTouch={handleGoToOrders}
          soundType="click"
        />
        <ButtonGeneral
          text="VOLVER AL CARRITO"
          textColor="white"
          bckColor={["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"]}
          borderColors={["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"]}
          onTouch={handleGoHome}
          soundType="click"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginHorizontal: 10
  },
  title: {
    fontSize: 26,
    fontFamily: 'Jost_600SemiBold',
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
