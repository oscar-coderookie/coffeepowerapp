import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { useTheme } from "@react-navigation/native";
import { auth, db } from "../../config/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import CustomHeader from "../../components/CustomHeader";
import logo from "../../assets/images/webp/logo-nuevo.webp";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import LoadingScreen from "../../components/LoadingScreen";

const CouponsClientScreen = () => {
  const { colors } = useTheme();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    const listenCoupons = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // 👇 Subcolección de cupones
        const couponsRef = collection(db, "users", user.uid, "coupons");

        // 👇 Traemos los cupones ordenados por fecha
        const q = query(couponsRef, orderBy("createdAt", "desc"));

        unsubscribe = onSnapshot(q, (snapshot) => {
          const list = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));

          setCoupons(list);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error leyendo cupones:", error);
        setLoading(false);
      }
    };

    listenCoupons();
    return () => unsubscribe && unsubscribe();
  }, []);

  // 🔹 Pantalla de carga
  if (loading) return <LoadingScreen />;

  // 🔹 Estado vacío
  if (coupons.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <CustomHeader title="Mis Cupones" showBack={false} />
        <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
          <Text style={[styles.text, { color: colors.text }]}>
            ☕ Aún no tienes descuentos activos ☕
          </Text>
        </View>
      </View>
    );
  }

  // 🔹 Lista
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Mis Cupones" showBack={false} />

      <FlatList
        data={coupons}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateX: -40 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{
              type: "timing",
              duration: 900,
              delay: index * 120,
            }}
          >
            <LinearGradient
              colors={["#e4c86dff", "#998030ff", "#e4c86dff", "#998030ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.code}>{item.code}</Text>

                {item.discount ? (
                  <Text style={styles.discount}>-{item.discount}% de descuento</Text>
                ) : null}

                {item.description ? (
                  <Text style={styles.description}>{item.description}</Text>
                ) : null}

                {item.expiresAt && (
                  <Text style={styles.expiry}>
                    Caduca: {
                      item.expiresAt.toDate
                        ? item.expiresAt.toDate().toLocaleDateString()
                        : item.expiresAt // por si algún cupón viejo es string
                    }
                  </Text>
                )}

                {item.used && (
                  <Text style={styles.used}>(Cupón ya utilizado)</Text>
                )}
              </View>

              <Image source={logo} style={styles.logo} />
            </LinearGradient>
          </MotiView>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontFamily: "Jost_600SemiBold", fontSize: 18 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },

  logo: {
    width: 80,
    height: 80,
    marginLeft: 20,
    opacity: 0.9,
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
    textTransform: "capitalize",
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
