import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { AddEraseBtn } from "../components/AddEraseBtn";
import { useNavigation, useTheme } from "@react-navigation/native";
import { MotiView, Moti } from 'moti';
import PriceTag from "../components/PriceTag";
import ButtonGeneral from "../components/ButtonGeneral";
import CustomHeader from "../components/CustomHeader";
import LoadingScreen from "../components/LoadingScreen";
import { Easing } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function ShopCart() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { cartItems, increaseQuantity, decreaseQuantity } = useContext(CartContext);
  const [loading, setLoading] = useState(true); // 👈 estado para controlar la carga
  const [imagesLoaded, setImagesLoaded] = useState(0); // 👈 contador de imágenes cargadas


  // Simular la carga del carrito (cuando viene de Firestore o context)
  useEffect(() => {
    const loadImages = async () => {
      if (!cartItems || cartItems.length === 0) {
        setLoading(false);
        return;
      }

      // Obtener URLs de imágenes válidas
      const imageUrls = cartItems
        .filter((item) => !!item.image)
        .map((item) => item.image);

      if (imageUrls.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Prefetch intenta descargar las imágenes a caché
        await Promise.all(imageUrls.map((url) => Image.prefetch(url)));

        // Pequeño delay visual (opcional)
        setTimeout(() => setLoading(false), 300);
      } catch (error) {
        console.warn("Error precargando imágenes:", error);
        // Apagar loader igual aunque haya error
        setLoading(false);
      }
    };

    // Timeout de seguridad (por si alguna imagen nunca responde)
    const timeout = setTimeout(() => setLoading(false), 4000);

    loadImages();

    return () => clearTimeout(timeout);
  }, [cartItems]);

  const isVerifiedOrGuest = !user || user?.emailVerified === true;

  const handleCheckout = () => {
    if (!user) {
      Alert.alert("Inicia sesión", "Debes iniciar sesión para realizar el pedido ☕");
      return;
    }
    if (!isVerifiedOrGuest) {
      Alert.alert("Verificación requerida", "Debes verificar tu correo electrónico antes de realizar un pedido 📧");
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      Alert.alert("Carrito vacío", "Agrega productos antes de continuar 🚀");
      return;
    }
    navigation.navigate("Checkout", { cartItems });
  };


  const totalCoffees = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.quantity * item.price),
    0
  );

  const renderItem = ({ item, index }) => (
    <MotiView
      from={{ opacity: 0, translateY: 40, scale: 0.9 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        type: "timing",
        duration: 800,
        delay: index * 120,
        easing: Easing.out(Easing.cubic),
      }}

    >
      <LinearGradient
        colors={["#000000ff", "#080808ff","#252525ff","#1a1a1aff", "#000000ff","#131313ff","#363636ff","#1a1a1aff", "#000000ff"]} // dorado metálico
        start={{ x: 0, y: 0}}
        end={{ x: 1, y: 1 }}
        style={styles.cardContainer}
      >
        <View style={styles.itemRow}>
          {item.image ? (
            <Image
              resizeMode="contain"
              source={{ uri: item.image }}
              style={styles.image}
            />
          ) : (
            <View
              style={[
                styles.image,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Text style={{ color: "#999" }}>Sin imagen</Text>
            </View>
          )}

          <View style={styles.info}>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.name}>{item?.name}</Text>
              <Text style={styles.notes}>{item.description}</Text>
              <Text style={styles.notes}>Saco de 300 gr. (Café molido)</Text>

            </View>
            <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
              <AddEraseBtn
                id={item.id}
                quantity={item?.quantity || 0}
                onIncrease={
                  isVerifiedOrGuest ? () => increaseQuantity(item.id) : null
                }
                onDecrease={
                  isVerifiedOrGuest ? () => decreaseQuantity(item.id) : null
                }
                disabled={!isVerifiedOrGuest}
              />
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 300 }}
              >
                <PriceTag
                  price={
                    (Number(item.price) || 0) * (Number(item.quantity) || 0)
                  }
                  currency=" €"
                />
              </MotiView>
            </View>

          </View>


        </View>
      </LinearGradient>

    </MotiView>
  );


  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <CustomHeader
        title={
          user ? "Tu experiencia Coffee Power ☕" : "Carrito de compra (Invitado)"
        }
        showBack={false}
      />

      {user && !isVerifiedOrGuest && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Verifica tu correo electrónico para habilitar las compras.
          </Text>
        </View>
      )}

      {!cartItems || cartItems.length === 0 ? (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 1000 }}
          style={styles.emptyContainer}
        >
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Tu carrito huele a café recién hecho... pero aún está vacío ☕️✨
          </Text>
          {!user && (
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() =>
                navigation.navigate("Área personal", { screen: "Login" })
              }
            >
              <Text style={styles.loginText}>Iniciar sesión</Text>
            </TouchableOpacity>
          )}
        </MotiView>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}
            showsVerticalScrollIndicator={false}
          />
          <View style={{ marginHorizontal: 10 }}>
            <MotiView
              from={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 800 }}
              style={styles.totalBox}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={[styles.totalLabel,{color:colors.text}]}>Total de cafés:</Text>
                <Text style={styles.totalPrice}>{totalCoffees}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
                <Text style={[styles.totalLabel,{color:colors.text}]}>Importe total:</Text>
                <Text style={styles.totalPrice}>{totalPrice.toFixed(2)} €</Text>
              </View>
            </MotiView>

            <ButtonGeneral
              text="☕ facturacíon y envío ☕"
              onTouch={handleCheckout}
              textColor="#000000ff"
              bckColor={[colors.gold, colors.goldSecondary, colors.gold,colors.goldSecondary, colors.gold]} 

              disable={!isVerifiedOrGuest}
            />
          </View>

        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardContainer: {
    marginHorizontal: 10,
    marginVertical: 4,
    backgroundColor: "#121212",
    borderRadius: 10,
    shadowColor: "#b58e31",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: "hidden",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: 'space-around',
    padding: 10,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 14,

  },
  info: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",

  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Jost_600SemiBold",
    textAlign: "center",
    textTransform: "capitalize",
  },
  notes: {
    color: "#aaa",
    fontSize: 10,
    textAlign: "right",
    fontFamily: "Jost_400Regular",
    marginTop: 2,
  },
  warningBox: {
    backgroundColor: "#b22222",
    padding: 10,
  },
  warningText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Jost_600SemiBold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {

    fontSize: 16,
    textAlign: "center",
    fontFamily: "Jost_500Medium",
  },
  loginBtn: {
    marginTop: 20,
    backgroundColor: "#b58e31",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  loginText: {
    color: "#fff",
    fontFamily: "Jost_600SemiBold",
  },
  totalBox: {
   
    marginVertical: 6,
    padding: 10,

  },
  totalLabel: {
    color: "#ccc",
    fontFamily: "Jost_500Medium",
    fontSize: 14,
  },
  totalValue: {
    color: "#fff",
    fontFamily: "Jost_600SemiBold",
    fontSize: 15,
  },
  totalPrice: {
    color: "#b58e31",
    fontFamily: "Jost_700Bold",
    fontSize: 20,
  },
});