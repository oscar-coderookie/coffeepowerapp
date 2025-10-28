import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { getCoffeesByTag } from '../data/CoffeesData';
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";
import FavoriteButton from "../components/FavouriteButton";
import { useEffect, useState } from "react";
import LoadingScreen from '../components/LoadingScreen';
import { MotiView } from "moti";

export default function CategoryScreen({ route }) {
  const { category } = route.params;
  const navigation = useNavigation();
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);

  loading

  useEffect(() => {
    const loadCoffees = async () => {
      const data = await getCoffeesByTag(category.key);
      setCoffees(data);
      setLoading(false);
    };
    loadCoffees();
  }, [category.key]);

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
      {/* 🔹 Header dinámico */}
      <CustomHeader
        title={category.name}
        showBack={true}
      />

      {loading ? (<LoadingScreen />) : (<View style={styles.overlay}>
        {category.legend && (
          <Text style={styles.legend}>{category.legend}</Text>
        )}

        <FlatList
          data={coffees}
          keyExtractor={(item) => item.name.toUpperCase()}
          style={styles.flatList}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => (

            <MotiView
              from={{ opacity: 0, translateY: 30, scale: 0.95 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{
                delay: index * 100, // ⏱ efecto cascada
                type: 'spring',
                damping: 20,
              }}
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("CoffeeDetail", { coffee: item })}
              >
                <FavoriteButton cafe={item} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                </View>

                <View style={styles.imageContainer}>
                  <Image
                    resizeMode="contain"
                    source={{ uri: item.image }}
                    style={styles.image}
                  />
                </View>

              </TouchableOpacity>
            </MotiView>

          )}
        />
      </View>)}
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
  flatList: {
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,

    borderRadius: 12,
    padding: 10,
  },
  cardInfo: {
    width: '65%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  cardTitle: {
    fontSize: 16,
    color: "#fff",
    fontFamily: 'Jost_600SemiBold',
    textTransform: 'capitalize',
    textAlign: 'center'
  },
  cardDesc: {
    fontSize: 12,
    color: "#ccc",
    textAlign: 'center',
    fontFamily: 'Jost_400Regular',
    marginTop: 4
  },
  imageContainer: {
    width: 108,
    height: 108,
    borderRadius: 54,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8
  },
  image: {
    width: "200%",
    height: "200%",
    transform: [{ translateX: -4 }, { translateY: 10 }]
  },
});
