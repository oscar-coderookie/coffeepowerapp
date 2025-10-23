import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { useTheme } from "@react-navigation/native";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import CustomHeader from "../components/CustomHeader";
import logo from "../assets/icon.png";
import { LinearGradient } from "expo-linear-gradient";

const CouponsClientScreen = () => {
  const { colors } = useTheme();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setCoupons(userData.coupons || []);
        }
      } catch (error) {
        console.error("Error cargando cupones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.text }]}>
          Cargando cupones...
        </Text>
      </View>
    );
  }

  if (coupons.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.text }]}>
          Aún no tienes descuentos activos ☕
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Mis Cupones" showBack={false} />

      <FlatList
        data={coupons}
        keyExtractor={(item, index) => `${item.code}-${index}`}
        renderItem={({ item }) => (
          <LinearGradient
            colors={["#e4c86dff", "#998030ff", "#e4c86dff", "#998030ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View>
              <Text style={styles.code}>{item.code}</Text>
              <Text style={styles.discount}>-{item.discount}% de descuento</Text>
              {item.description ? (
                <Text style={styles.description}>{item.description}</Text>
              ) : null}
              {item.expiresAt ? (
                <Text style={styles.expiry}>
                  Caduca: {item.expiresAt}
                </Text>
              ) : null}
              {item.used && (
                <Text style={styles.used}>(Cupón ya utilizado)</Text>
              )}
            </View>

            <View>
              <Image
                source={logo}
                style={{ width: 100, height: 100, marginLeft: 30 }}
              />
            </View>
          </LinearGradient>
        )}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontFamily: "Jost_400Regular", fontSize: 16 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 18,
    marginBottom: 15,
  },

  code: {
    fontFamily: "Jost_700Bold",
    fontSize: 20,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  discount: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 17,
    marginBottom: 6,
  },
  description: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 14,
    marginBottom: 4,
    textTransform:'capitalize'
  },
  expiry: {
    fontFamily: "Jost_400Regular",
    fontSize: 12,
  },
  used: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 13,
    color: "#B22222",
    marginTop: 6,
  },
});

export default CouponsClientScreen;
