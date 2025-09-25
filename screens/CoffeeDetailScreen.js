import { View, Text, StyleSheet, Image, ScrollView, Dimensions, ImageBackground, TouchableOpacity, Alert } from "react-native";
import Header from "../components/CustomHeader";
import MarqueeTitle from "../components/AnimatedTitle";
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "../context/CartContext";

const { width, height } = Dimensions.get("window");

//contexto:


export default function CoffeeDetailScreen({ route }) {
  const { coffee } = route.params;
  const { addToCart } = useContext(CartContext);


  const handleAddToCart = () => {
    addToCart(coffee);
    Alert.alert("Añadido al carrito", `${coffee.name} se ha agregado a tu carrito`);
  };


  return (
    <View style={{ flex: 1 }}>
      {/* 👇 Header con MarqueeTitle */}
      <Header>
        <MarqueeTitle title={coffee.name} />
      </Header>

      <ScrollView contentContainerStyle={styles.container}>
        <ImageBackground
          source={coffee.background}
          resizeMode="cover"
          style={styles.background}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.subtitle}>Perfil Sensorial:</Text>
            {coffee.profile?.length > 0 &&
              coffee.profile.map((item, index) => (
                <Text key={index} style={styles.desc}>
                  - {item}
                </Text>
              ))}
          </View>
        </ImageBackground>

        <View style={styles.section2}>
          <View style={styles.infoContainer}>
            <Text style={styles.subtitle}>👅 Notas de Cata:</Text>
            {coffee.tasteNotes?.length > 0 &&
              coffee.tasteNotes.map((item, index) => (
                <Text style={styles.desc} key={index}>
                  - {item}
                </Text>
              ))}

            <Text style={styles.subtitle}>💖 Descripción emocional:</Text>
            {coffee.emotionalDescription?.length > 0 &&
              coffee.emotionalDescription.map((item, index) => (
                <Text style={styles.desc} key={index}>
                  {item}
                </Text>
              ))}
          </View>
        </View>

        <View style={styles.imageContainer}>

          <Image style={styles.package} source={coffee.image} />
          <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
            <Ionicons name="add-circle" size={24} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.cartButtonText}>Añadir al carrito</Text>
          </TouchableOpacity>
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

  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: "#0e0e0eff",
    justifyContent: 'center',
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
    width: "60%",
    transform: [{ translateX: -8 }],
    resizeMode: "contain",
  },
  cartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Jost_600SemiBold",
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#a88e19ff", // color café
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    transform: [{ translateY: -130 }],

  }
});
