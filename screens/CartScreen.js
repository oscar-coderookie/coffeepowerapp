import { useContext } from "react";
import { CartContext } from "../context/CartContext";

import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function CartScreen() {
  const { cartItems } = useContext(CartContext);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.coffeeImage} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        {item.description && <Text style={styles.notes}>{item.description}</Text>}
      </View>
     
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Tu carrito está vacío ☕</Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0e0e0e", width: '100%' },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#fff", fontSize: 18 },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  coffeeImage: { width: 60, height: 60, resizeMode: "contain", marginRight: 10 },
  info: { flex: 1 },
  name: { color: "#fff", fontSize: 16 },
  notes: { color: "#ccc", fontSize: 12 },
 
});
