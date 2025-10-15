import { View, Text, StyleSheet, Image, ScrollView, Dimensions, ImageBackground, TouchableOpacity, Alert, TextInput } from "react-native";
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "../context/CartContext";
import CustomHeader from "../components/CustomHeader";

const { width, height } = Dimensions.get("window");

export default function CoffeeDetailScreen({ route }) {
  const { coffee } = route.params;
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({ ...coffee, quantity });
    Alert.alert(
      "Añadido al carrito",
      `${quantity} x ${coffee.name} se agregó a tu carrito`
    );
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <View style={{ flex: 1 }}>
      {/* 👇 Header con MarqueeTitle */}

      <CustomHeader title={coffee.name} showBack={true} />


      <ScrollView contentContainerStyle={styles.container}>
        <ImageBackground
          source={{ uri: coffee.background }}
          resizeMode="cover"
          style={styles.background}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.subtitle}>Perfil Sensorial:</Text>
            {(coffee.profile ?? []).map((item, index) => (
              <Text key={index} style={styles.desc}>
                - {item}
              </Text>
            ))}
          </View>
        </ImageBackground>

        <View style={styles.section2}>
          <View style={styles.infoContainer}>
            <Text style={styles.subtitle}>👅 Notas de Cata:</Text>
            {(coffee.tasteNotes ?? []).map((item, index) => (
              <Text key={index} style={styles.desc}>
                - {item}
              </Text>
            ))}

            <Text style={styles.subtitle}>💖 Descripción emocional:</Text>
            {(coffee.emotionalDescription ?? []).map((item, index) => (
              <Text key={index} style={styles.desc}>
                {item}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: coffee.image }}
            style={styles.package}
            resizeMode="contain"
          />

          <View style={styles.generalContainer}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity style={styles.qtyButton} onPress={decreaseQuantity}>
                <Ionicons name="remove" size={20} color="#fff" />
              </TouchableOpacity>

              <TextInput
                style={styles.qtyInput}
                value={quantity.toString()}
                keyboardType="numeric"
                onChangeText={(text) => {
                  const num = parseInt(text) || 1;
                  setQuantity(num > 0 ? num : 1);
                }}
              />

              <TouchableOpacity style={styles.qtyButton} onPress={increaseQuantity}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* 🛒 Botón de añadir */}
            <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
              <Ionicons name="cart" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.cartButtonText}>Añadir al carrito</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  section2: {
    flex: 1,
    paddingTop: 40,
    backgroundColor:'#000000ff'
  },
  imageContainer: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#0e0e0eff",
    paddingTop: 100,
    paddingBottom: 100
  },
  infoContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0c0c0c44",
  },
  background: {
    width: width,
    height: height,
    justifyContent: "center",
  },
  desc: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
    textAlign: "justify",
    width: "100%",
    fontFamily: "Jost_400Regular",
  },
  subtitle: {
    color: "#fff",
    textAlign: "left",
    marginBottom: 20,
    width: "100%",
    fontFamily: "Jost_600SemiBold",
    textTransform: "uppercase",
    fontSize: 20,
  },
  package: {
    width: width ,
    height: 400,
    transform: [{translateX: -10}]
  },
  cartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Jost_600SemiBold",
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#a88e19ff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 6,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#1c1c1cff",
    borderRadius: 6,
  },
  qtyButton: {
    padding: 16,
    backgroundColor: "#a88e19ff",
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  qtyInput: {
    width: 40,
    margin: 10,
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: 10,
    textAlign: "center",
    fontFamily: "Jost_600SemiBold",
    fontSize: 16,
  },
  generalContainer: {

  }
});
