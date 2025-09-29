import { useContext } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { CartContext } from "../context/CartContext";

export const AddEraseBtn = ({ id, quantity }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);

  return (
    <View style={styles.quantityContainer}>
      <TouchableOpacity
        style={styles.qtyButton}
        onPress={() => decreaseQuantity(id)}
      >
        <Text style={styles.qtyText}>−</Text>
      </TouchableOpacity>

      <Text style={styles.quantity}>{quantity}</Text>

      <TouchableOpacity
        style={styles.qtyButton}
        onPress={() => increaseQuantity(id)}
      >
        <Text style={styles.qtyText}>+</Text>
      </TouchableOpacity>

      {/* Botón eliminar */}

    </View>
  );
};
;

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
  deleteText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

});
