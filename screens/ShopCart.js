import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { AddEraseBtn } from "../components/AddEraseBtn";
import { useNavigation, useTheme } from "@react-navigation/native";
import PriceTag from "../components/PriceTag";

export default function ShopCart() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const { user } = useContext(AuthContext);
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);

  // 🔹 Validación de checkout
  const handleCheckout = () => {
    if (!user) {
      Alert.alert(
        "Inicia sesión",
        "Debes iniciar sesión para realizar el pedido ☕"
      );
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      Alert.alert("Carrito vacío", "Agrega productos antes de continuar 🚀");
      return;
    }

    navigation.navigate("Checkout");
  };

  // 🔹 Total de cafés
  const totalCoffees = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  // Total de precio
const totalPrice = cartItems.reduce(
  (sum, item) => sum + (item.quantity * 30), // 30€ por unidad
  0
);

  // 🔹 Render individual de cada producto
  const renderItem = ({ item }) => (
    <View style={styles.mainContainer}>
      <View style={styles.itemContainer}>
        {item.image ? (
          <Image
            resizeMode="contain"
            source={{ uri: item.image }}
            style={styles.coffeeImage}
          />
        ) : (
          <View
            style={[
              styles.coffeeImage,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
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
            onIncrease={() => increaseQuantity(item.id)}
            onDecrease={() => decreaseQuantity(item.id)}
          />
        </View>
        <PriceTag price={`${item.quantity * 30}`} currency="€"/>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: colors.background,
          backgroundColor: colors.text,
          textTransform: "uppercase",
          fontFamily: "Jost_600SemiBold",
          fontSize: 20,
          textAlign: "center",
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        {user ? "Resumen de tu Compra:" : "Carrito de compra (INVITADO)"}
      </Text>

      {!cartItems || cartItems.length === 0 ? (
        <View
          style={[styles.emptyContainer, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.emptyText, { color: colors.text }]}>
            "Tu carrito está vacío ☕"
          </Text>

          {!user && (
            <TouchableOpacity
              style={styles.login}
              onPress={() =>
                navigation.navigate("Área personal", { screen: "Login" })
              }
            >
              <Text style={styles.loginText}>Clic aquí para iniciar sesión</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            renderItem={renderItem}
            contentContainerStyle={{
              paddingBottom: 20,
              paddingTop:10

            }}
          />

          {/* 🔹 Total de cafés */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingVertical:14,
              borderTopColor: colors.text,
              borderTopWidth: 1
            }}
          >
            <Text style={{ color: colors.text }}>Total:</Text>
            <Text style={{ color: colors.text }}>{totalCoffees} Productos</Text>
            <Text style={{ color: colors.text }}>{totalPrice} €</Text>
            
          </View>

          {/* 🔹 Botón de checkout */}
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.text,
              padding: 10,
              borderRadius: 10,
              marginBottom: 20,
              marginHorizontal: 20,
            }}
            onPress={handleCheckout}
          >
            <Text
              style={{
                color: colors.background,
                textTransform: "uppercase",
                fontFamily: "Jost_600SemiBold",
                fontSize: 18,
                textAlign: "center",
              }}
            >
              ☕ Iniciar Pedido ☕
            </Text>
          </TouchableOpacity>
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
    backgroundColor: "#1a1a1a",
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  itemContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginBottom: 15,
    borderRadius: 10,
    flex: 1,
  },
  coffeeImage: {
    width: 120,
    height: 120,
    marginRight: 10,
    borderRadius: 10,
  },
  name: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Jost_600SemiBold",
    textAlign: "center",
    textTransform: "capitalize",
  },
  notes: {
    color: "#ccc",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Jost_400Regular",
  },
  deleteText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  infoContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  deleteButton: {
    marginRight: 20,
    backgroundColor: "#b22222",
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  login: { padding: 30 },
  loginText: { color: "#0066ff" },
});
