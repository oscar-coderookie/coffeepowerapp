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
import { AuthContext } from "../context/AuthContext"; // 🔹 Nuevo import
import { AddEraseBtn } from "../components/AddEraseBtn";
import { useNavigation, useTheme } from "@react-navigation/native";

export default function ShopCart() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  // 🔹 Contextos
  const { user } = useContext(AuthContext); // autenticación global
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
          <Text style={styles.name}>{item?.name}</Text>
          <Text style={styles.notes}>Saco de 300 Gramos.</Text>

          <AddEraseBtn
            id={item.id}
            quantity={item?.quantity || 0}
            onIncrease={() => increaseQuantity(item.id)}
            onDecrease={() => decreaseQuantity(item.id)}
          />
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 🔹 UI
  return (
    <View style={styles.container}>
      <Text
        style={{
          color: colors.background,
          backgroundColor: colors.text,
          textTransform: "uppercase",
          fontFamily: "Jost_600SemiBold",
          fontSize: 24,
          textAlign: "center",
          marginBottom: 20,
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
            {user
              ? "Tu carrito está vacío ☕"
              : "Agrega productos para guardarlos temporalmente ☕"}
          </Text>

          {/* 🔹 Botón de login solo si no hay usuario */}
          {!user && (
            <TouchableOpacity
              style={styles.login}
              onPress={()=> navigation.navigate("Área personal", { screen: "Login" })} // ✅ Ya no pasamos por "Área personal"
            >
              <Text style={styles.loginText}>Clic aquí para iniciar sesión</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      {cartItems && cartItems.length > 0 && (
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.text,
            padding: 20,
            borderRadius: 10,
            marginBottom: 20,
            margin: 10,
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
      )}
    </View>
  );
}

// 🔹 Estilos
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, textAlign: "center", width: "80%" },
  mainContainer: {
    backgroundColor: "#1a1a1a",
    marginBottom: 10,
    borderRadius: 10,
    margin: 10,
  },
  itemContainer: {
    alignItems: "center",
    justifyContent: "space-around",
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
  name: { color: "#fff", fontSize: 14, fontFamily: "Jost_600SemiBold" },
  notes: { color: "#ccc", fontSize: 12, textAlign: "justify", width: "100%" },
  deleteText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  infoContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "flex-start",
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
