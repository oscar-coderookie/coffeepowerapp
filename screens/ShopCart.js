import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { AddEraseBtn } from "../components/AddEraseBtn";
import { useNavigation, useTheme } from "@react-navigation/native";
import { MotiView } from 'moti';
import PriceTag from "../components/PriceTag";
import ButtonGeneral from "../components/ButtonGeneral";
import CustomHeader from "../components/CustomHeader";
import LoadingScreen from "../components/LoadingScreen";
import { Easing } from "react-native-reanimated";

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

  const isVerifiedOrGuest = !user || user?.emailVerified === true;
  const totalCoffees = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const renderItem = ({ item, index }) => (

    <MotiView
      from={{ opacity: 0, translateY: 40, scale: 0.85 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        type: 'timing',
        duration: 1200,
        delay: index * 220,
        easing: Easing.out(Easing.cubic), // aparición escalonada
      }}
      style={[styles.mainContainer, {backgroundColor: "#0e0e0eff"}]}>
      <View style={styles.itemContainer}>
        {item.image ? (
          <Image resizeMode="contain"
            source={{ uri: item.image }}
            style={styles.coffeeImage}
          />
        ) : (
          <View style={[styles.coffeeImage, { justifyContent: "center", alignItems: "center" }]}>
            <Text style={{ color: "#999" }}>Sin imagen</Text>
          </View>
        )}
        <View style={styles.infoContainer}>
          <View style={styles.coffeeTitle}>
            <Text style={styles.name}>{item?.name}</Text>
            <Text style={styles.notes}>Café molido: Saco de 300 Gramos.</Text>
          </View>
          <AddEraseBtn
            id={item.id}
            quantity={item?.quantity || 0}
            onIncrease={isVerifiedOrGuest ? () => increaseQuantity(item.id) : null}
            onDecrease={isVerifiedOrGuest ? () => decreaseQuantity(item.id) : null}
            disabled={!isVerifiedOrGuest}
          />
        </View>
        <PriceTag price={(Number(item.price) || 0) * (Number(item.quantity) || 0)} currency="€" />
      </View>
    </MotiView>

  );

  if (loading) {
    return <LoadingScreen />;
  }


  return (
    <View style={styles.container}>
      <CustomHeader title={user ? "Resumen de tu Compra:" : "Carrito de compra (INVITADO)"} showBack={false} />

      {user && !isVerifiedOrGuest && (
        <View style={{ backgroundColor: "#b22222", padding: 10 }}>
          <Text style={{ color: "#fff", textAlign: "center", fontFamily: "Jost_600SemiBold" }}>
            ⚠️ Verifica tu correo electrónico para habilitar las compras.
          </Text>
        </View>
      )}

      {!cartItems || cartItems.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.emptyText, { color: colors.text }]}>Tu carrito está vacío ☕</Text>
          {!user && (
            <TouchableOpacity
              style={styles.login}
              onPress={() => navigation.navigate("Área personal", { screen: "Login" })}>
              <Text style={styles.loginText}>Clic aquí para iniciar sesión</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
          />

          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderTopColor: colors.text,
            borderTopWidth: 1,
          }}>
            <Text style={{ color: colors.text }}>Total:</Text>
            <Text style={{ color: colors.text }}>{totalCoffees} Productos</Text>
            <Text style={{ color: colors.text }}>{totalPrice} €</Text>
          </View>

          <ButtonGeneral
            text='☕ Iniciar Pedido ☕'
            onTouch={handleCheckout}
            textColor={colors.background}
            bckColor={colors.text}
            marginHorizontal={10}
            disable={!isVerifiedOrGuest} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, textAlign: "center", width: "80%" },
  mainContainer: {
    marginBottom: 10, 
    borderRadius: 10, 
    marginHorizontal: 10, 
    shadowColor: '#b98e43', // dorado cálido
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: 12,
  },
  itemContainer: { alignItems: "center", justifyContent: "flex-start", flexDirection: "row", marginBottom: 15, borderRadius: 10, flex: 1 },
  coffeeImage: { width: 120, height: 120, marginRight: 10, borderRadius: 10 },
  name: { color: "#fff", fontSize: 14, fontFamily: "Jost_600SemiBold", textAlign: "center", textTransform: "capitalize" },
  notes: { color: "#ccc", fontSize: 12, textAlign: "center", fontFamily: "Jost_400Regular" },
  infoContainer: { justifyContent: "center", flex: 1, alignItems: "center" },
  login: { padding: 30 },
  loginText: { color: "#0066ff" },
});
