import { View, Text, StyleSheet, FlatList, Image, ImageBackground, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { getCoffeesByTag } from '../data/CoffeesData';
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const screenHeight = Dimensions.get("window").height;

export default function CategoryScreen({ route }) {
  const { category } = route.params;
  const navigation = useNavigation(); // 👈 aquí
  // OJO: aquí usamos category.key, no category.tags
  const coffees = getCoffeesByTag(category.key);

  return (
    <LinearGradient
      colors={[
        "rgb(44, 44, 44)",
        "rgb(5, 5, 5)",
        "rgba(43, 43, 43, 1)",
        "rgba(38, 38, 38, 1)"
      ]}
      locations={[0, 0.27, 0.70, 1]}
      start={{ x: 0.5, y: 1 }}   // de abajo hacia arriba
      end={{ x: 0.5, y: 0 }}
      style={styles.bg}
    >
      <View style={styles.overlay}>
        <Text style={styles.legend}>{category.legend}</Text>
        <FlatList
          data={coffees}
          style={styles.flatList}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("CoffeeDetail", { coffee: item })}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
              </View>
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} />
              </View>

            </TouchableOpacity>
          )}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: "cover" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 10, textAlign: 'center', fontFamily: 'Jost_600SemiBold' },
  legend: { fontSize: 16, color: "#ccc", textAlign: "center", marginBottom: 20, fontFamily: 'Jost_400Regular' },
  card: { flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  imageContainer: {
    width: 108,        // más grande que antes
    height: 108,       // debe ser igual para que sea un círculo
    borderRadius: 54,  // la mitad del tamaño
    overflow: "hidden", // 🔑 recorta la imagen dentro del círculo
    backgroundColor: "#333", // opcional, por si quieres un borde de color
    margin: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width:'142%',
    resizeMode: "contain",
    transform: [{ translateX: -7 }, {translateY: 20 }]
  },
  cardTitle: {
    fontSize: 14, fontWeight: "bold", color: "#ffffffff", textAlign: 'center', fontFamily: 'Jost_600SemiBold', textTransform: 'capitalize'
  },
  cardDesc: { fontSize: 12, color: "#ffffffff", textAlign: 'center', fontFamily: 'Jost_400Regular', marginBottom: 4, marginTop: 4  },
  flatList: {
    margin: 0,
    height: '100%',
    textAlign:'justify'
  },
  cardInfo: {
    width: '66%',
    backgroundColor: '#5f5f5f71',
    padding: 8,
    alignItems: 'center',
    justifyContent:'center',
    borderRadius: 10
  }
});