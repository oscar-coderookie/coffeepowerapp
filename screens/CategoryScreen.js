import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from "react-native";
import { getCoffeesByTag } from '../data/CoffeesData';
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";

const screenHeight = Dimensions.get("window").height;

export default function CategoryScreen({ route }) {
  const { category } = route.params;
  const navigation = useNavigation();

  // Aquí usamos category.key para filtrar los cafés
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
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.bg}
    >
      {/* 🔥 Header dinámico */}
      <CustomHeader 
        title={category.name} 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.overlay}>
        <Text style={styles.legend}>{category.legend}</Text>

        <FlatList
          data={coffees}
          style={styles.flatList}
          keyExtractor={(item) => item.name.toUpperCase()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("CoffeeDetail", { coffee: item })}
            >
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
  legend: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: 'Jost_400Regular'
  },
  card: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  imageContainer: {
    width: 108,
    height: 108,
    borderRadius: 54,
    overflow: "hidden",
    backgroundColor: "#333",
    margin: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width: '142%',
    resizeMode: "contain",
    transform: [{ translateX: -7 }, { translateY: 20 }]
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: 'center',
    fontFamily: 'Jost_600SemiBold',
    textTransform: 'capitalize'
  },
  cardDesc: {
    fontSize: 12,
    color: "#fff",
    textAlign: 'center',
    fontFamily: 'Jost_400Regular',
    marginBottom: 4,
    marginTop: 4
  },
  flatList: {
    margin: 0,
    height: '100%',
    textAlign: 'justify'
  },
  cardInfo: {
    width: '66%',
    backgroundColor: '#5f5f5f71',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  }
});
