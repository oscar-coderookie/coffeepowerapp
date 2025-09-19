import { View, Text, StyleSheet, Image, ScrollView, Dimensions, ImageBackground } from "react-native";

const { width, height } = Dimensions.get("window");

export default function CoffeeDetailScreen({ route }) {
  const { coffee } = route.params; // 👈 recibimos el café

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground 
        source={coffee.background}
        resizeMode="cover"
        style={styles.background}>
        <Text style={styles.name}>{coffee.name}</Text>
        <Text style={styles.desc}>{coffee.description}</Text>
      </ImageBackground>
      <View>
        <Text>{coffee.name}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  
  },
  image: {
    justifyContent: 'center'
  },
  background: {
    width: width,
    height: height,   // 👈 ocupa toda la pantalla
    justifyContent: "center",
    alignItems: "center",
  },
  imgContainer: {
    width: '100%',
    justifyContent: 'center'
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  desc: { fontSize: 16, color: "#ccc", marginBottom: 20, textAlign: "justify" },
  extra: { fontSize: 16, color: "#aaa", marginBottom: 10 },
});
