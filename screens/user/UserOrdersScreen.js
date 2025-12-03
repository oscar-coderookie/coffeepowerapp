import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { auth } from "../../config/firebase"; // Asegúrate de tener esto
import CustomHeader from "../../components/CustomHeader";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { listenUserOrders } from "../../services/checkoutService";

export default function UserOrdersScreen({ navigation }) {
  const { colors } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenUserOrders(user.uid, setOrders, setLoading);

    return () => unsubscribe && unsubscribe();
  }, [user]);

  if (orders.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>

        <Text style={{ color: colors.text, fontFamily: "Jost_500Medium" }}>
          Aún no tienes pedidos.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.text, fontFamily: "Jost_500Medium", marginHorizontal:10, padding: 10, textAlign:'justify' }}>
        Aquí se listan todas las compras realizadas dentro de la app, pincha en las tarjetas para ir al seguimiento y detalle:
      </Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ marginHorizontal: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Detalle pedido cliente", { order: item })}
          >
            <LinearGradient
              colors={[
                colors.card,
                colors.background,
                colors.card,
                colors.background,
                colors.card,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.row}>
                <Ionicons name="receipt-outline" size={26} color={colors.text} />
                <Text style={[styles.orderNumber, { color: colors.text }]}>
                  Pedido #{item.orderNumber}
                </Text>
              </View>

              <View
                style={{ flexDirection: "row", justifyContent: "space-between" }}
              >
                <View>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Total:
                  </Text>
                  <Text style={[styles.value, { color: colors.text }]}>
                    € {item.total?.toFixed(2)}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Items:
                  </Text>
                  <Text style={[styles.value, { color: colors.text }]}>
                    {item.totalUnits}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Entrega:
                  </Text>
                  <Text style={[styles.value, { color: colors.text }]}>
                    {item.shippingMethod}
                  </Text>
                </View>
        
              </View>
              <View
                style={{ flexDirection: "row", justifyContent: "space-between" }}
              >
                <View>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Fecha y hora de creación:
                  </Text>
                  <Text style={[styles.value, { color: colors.text }]}>
                    {item.createdAt?.toDate().toLocaleString()}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Estado:
                  </Text>
                  <Text style={[styles.value, { color: colors.text }]}>
                    {item.status}
                  </Text>
                </View>
              </View>


            </LinearGradient>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    padding: 18,
    borderRadius: 35,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  orderNumber: {
    marginLeft: 10,
    color: "#FFD700",
    fontFamily: "Jost_700Bold",
  },

  label: {
    color: "#bbbbbb",
    fontSize: 13,
    marginTop: 6,
    fontFamily: "Jost_400Regular",
  },

  value: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Jost_500Medium",
  },

  id: {
    fontFamily: "Jost_600SemiBold",
    marginLeft: 6,
  },
});
