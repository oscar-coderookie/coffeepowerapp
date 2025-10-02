import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { AddEraseBtn } from "../components/AddEraseBtn";
import { useNavigation, useTheme } from "@react-navigation/native";

export default function ShopCart() {
  const { colors } = useTheme();
  const { cartItems, removeFromCart } = useContext(CartContext);
  const navigation = useNavigation(); // 👈 instancia de navegación

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      Alert.alert("Carrito vacío", "Agrega productos antes de continuar 🚀");
      return;
    }
    navigation.navigate("Checkout"); // 👈 tu screen de pago/dirección
  };

  const renderItem = ({ item }) => (

    <View style={styles.mainContainer}>
      <View style={styles.itemContainer}>
        <Image source={item?.image} style={styles.coffeeImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item?.name}</Text>
          <Text style={styles.notes}>Saco de 300 Gramos.</Text>
          <AddEraseBtn id={item.id} quantity={item?.quantity || 0} />
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

  return (
    <View style={styles.container}>
      <Text style={{
        color: colors.text,
        backgroundColor: colors.background,
        textTransform: 'uppercase',
        fontFamily: 'Jost_600SemiBold',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        paddingTop: 20,
        paddingBottom: 20,
      }}>Resumen de tu Compra:</Text>
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
      {cartItems.length > 0 && (

        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.text,
            padding: 20,
            borderRadius: 10,
            marginBottom: 20,
            margin: 10
          }}
          onPress={handleCheckout}
        >
          <Text style={{
            color: colors.background,
            textTransform: 'uppercase',
            fontFamily: 'Jost_600SemiBold',
            fontSize: 18,
            textAlign: 'center',

          }}>☕ iniciar pedido ☕</Text>

        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#464646ff", justifyContent: 'center' },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#fff", fontSize: 18 },
  mainContainer: {
    backgroundColor: "#1a1a1a",
    marginBottom: 10,
    borderRadius: 10,
    margin: 10

  },
  itemContainer: {
    alignItems: "center",
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 10,
    flex: 1
  },
  coffeeImage: { width: 120, height: 120, resizeMode: "contain", marginRight: 10 },
  name: { color: "#fff", fontSize: 14, fontFamily: 'Jost_600SemiBold', },
  notes: { color: "#ccc", fontSize: 12, textAlign: 'justify', width: '100%' },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,

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
  nextBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8a6d0dff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    margin: 10
  },
  infoContainer: {
    justifyContent: 'center',
    flex: 1,             // 👈 le das todo el espacio libre al lado de la imagen
    alignItems: 'flex-start',
  },
  deleteButton: {
    marginRight: 20,
    backgroundColor: "#b22222", // rojo oscuro
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
