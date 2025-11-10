import React, { useContext, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { CartContext } from "../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { playSound } from "../utils/soundPlayer";
import Toast from "react-native-toast-message";

export const AddEraseBtn = ({ id, quantity, coffeeName }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);
  const [showDelete, setShowDelete] = useState(false);

  // 🔹 Disminuir cantidad o eliminar si está en 1
  const handleDecrease = () => {
    try {
      if (quantity <= 1) {
        handleRemove();
      } else {
        decreaseQuantity(id);
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo actualizar la cantidad.",
      });
    }
  };

  // 🔹 Aumentar cantidad
  const handleIncrease = () => {
    try {
      increaseQuantity(id);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo actualizar la cantidad.",
      });
    }
  };

  // 🔹 Mantener presionado el menos: mostrar botón eliminar
  const handleLongPress = () => {
    setShowDelete(true);
    setTimeout(() => setShowDelete(false), 2500); // Se oculta después de 2.5s
  };

  // 🔹 Eliminar producto del carrito
  const handleRemove = () => {
    playSound("cup");
    removeFromCart(id);
    setShowDelete(false);
    Toast.show({
      type: "error",
      text1: coffeeName,
      text2: "Café eliminado del carrito de compras.",
    });
  };

  return (
    <View style={styles.container}>
      {/* 🔸 Botón rojo de eliminar a la izquierda */}


      {/* 🔸 Bloque principal de cantidad */}
      <View style={styles.quantityContainer}>
        {showDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleRemove}>
            <Ionicons style={{marginLeft:4}} name="trash-outline" size={22} color="red" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.qtyButton}
          onPress={handleDecrease}
          onLongPress={handleLongPress}
          delayLongPress={600}
        >
          {quantity <= 1 ? (
            <Ionicons name="trash-outline" size={24} color="#ff4444" />
          ) : (
            <Text style={styles.qtyText}>−</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.quantity}>{quantity}</Text>

        <TouchableOpacity style={styles.qtyButton} onPress={handleIncrease}>
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    overflow: "hidden",
  },
  qtyButton: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  quantity: {
    color: "#fff",
    fontSize: 18,
    marginHorizontal: 10,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});
