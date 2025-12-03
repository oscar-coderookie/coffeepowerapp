import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../config/firebase";
import CustomHeader from "../../components/CustomHeader";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function OrdersScreen({navigation}) {
  const { colors } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ref = collection(db, "orders");
        const q = query(ref, orderBy("createdAt", "asc"));

        const snap = await getDocs(q);

        const data = snap.docs.map((doc, index) => ({
          id: doc.id,
          orderIndex: index + 1,
          ...doc.data(),
        }));

        setOrders(data);
      } catch (err) {
        console.error("Error cargando órdenes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.text, fontFamily: "Jost_500Medium" }}>
          Cargando pedidos...
        </Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <CustomHeader title="Pedidos" />
        <Text style={{ color: colors.text, fontFamily: "Jost_500Medium" }}>
          No hay pedidos todavía.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Pedidos" />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("Detalle pedido", { order: item })}>

            <LinearGradient
              colors={[colors.card, colors.background, colors.card, colors.background, colors.card]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.row}>
                <Ionicons name="receipt-outline" size={26} color={colors.text} />
                <Text style={[styles.orderNumber, { color: colors.text }]}>
                  Pedido #{item.orderIndex} -
                </Text>
                <Text style={[styles.id, { color: colors.text }]}>ID: {item.id}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={[styles.label, { color: colors.text }]}>Cliente:</Text>
                  <Text style={[styles.value, { color: colors.text }]}>{item.userName}</Text>
                </View>
                <View>
                  <Text style={[styles.label, { color: colors.text }]}>Estado:</Text>
                  <Text style={[styles.value, { color: colors.text }]}>
                    {item.status}
                  </Text>
                </View>
              </View>


              <Text style={[styles.label, { color: colors.text }]}>Fecha y hora de creación:</Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {item.createdAt?.toDate().toLocaleString()}
              </Text>
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

  // Tarjeta estilo CoffeePower
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
    fontFamily: 'Jost_600SemiBold',
    marginLeft: 6
  }
});
