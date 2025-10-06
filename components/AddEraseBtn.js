// components/AddEraseBtn.js
import React, { useContext } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { CartContext } from "../context/CartContext";

export const AddEraseBtn = ({ id, quantity }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart, user } = useContext(CartContext);

  const handleDecrease = () => {
    try {
      if (quantity <= 1) {
        removeFromCart(id);
      } else {
        decreaseQuantity(id);
      }
    } catch (err) {
      console.error("[AddEraseBtn] error decrease:", err);
      Alert.alert("Error", "No se pudo actualizar la cantidad.");
    }
  };

  const handleIncrease = () => {
    try {
      increaseQuantity(id);
    } catch (err) {
      console.error("[AddEraseBtn] error increase:", err);
      Alert.alert("Error", "No se pudo actualizar la cantidad.");
    }
  };

  return (
    <View style={styles.quantityContainer}>
      <TouchableOpacity style={styles.qtyButton} onPress={handleDecrease}>
        <Text style={styles.qtyText}>−</Text>
      </TouchableOpacity>

      <Text style={styles.quantity}>{quantity}</Text>

      <TouchableOpacity style={styles.qtyButton} onPress={handleIncrease}>
        <Text style={styles.qtyText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  qtyButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  qtyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    color: "#fff",
    fontSize: 16,
    marginHorizontal: 10,
    fontWeight: "600",
  },
});
