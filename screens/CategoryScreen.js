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
import { useNavigation, useTheme } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";
import FavoriteButton from "../components/FavouriteButton";
import { useEffect, useState } from "react";
import LoadingScreen from '../components/LoadingScreen';
import { MotiView } from "moti";
import { playSound } from "../utils/soundPlayer";

async function prefetchImages(items) {
  try {
    const promises = items.map((item) => Image.prefetch(item.image));
    await Promise.all(promises);
  } catch (error) {
    console.warn("Error prefetching images:", error);
  }
}

export default function CategoryScreen({ route }) {
  const { category } = route.params;
  const navigation = useNavigation();
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    const loadCoffees = async () => {
      try {
        // 🔹 1. Cargar los datos
        const data = await getCoffeesByTag(category.key);
        setCoffees(data);

        // 🔹 2. Prefetch de imágenes (antes de mostrar pantalla)
        await prefetchImages(data);

        // 🔹 3. Desactivar pantalla de carga solo cuando todo esté listo
        setLoading(false);
      } catch (error) {
        console.error("Error loading coffees:", error);
        setLoading(false);
      }
    };

    loadCoffees();
  }, [category.key]);

  // 🔹 Mostrar pantalla de carga personalizada mientras carga
  if (loading) return <LoadingScreen />;

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

      {loading ? (<LoadingScreen />) : (<View style={[styles.overlay, { backgroundColor: colors.background }]}>
        {category.legend && (
          <Text style={[styles.legend, { color: colors.text }]}>{category.legend}</Text>
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
                style={[styles.card, { backgroundColor: colors.card }]}
                onPress={() => {
                  playSound('click');
                  navigation.navigate("CoffeeDetail", { coffee: item })
                }}
              >
                <FavoriteButton cafe={item} />
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.cardDesc, { color: colors.text }]}>{item.description}</Text>
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
  overlay: { flex: 1, paddingHorizontal: 10 },
  legend: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    paddingTop: 16,
    fontFamily: 'Jost_600SemiBold'
  },
  flatList: {
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
    width: 80,
    height: 80,
    borderRadius: 45,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8
  },
  image: {
    width: "300%",
    height: "300%",
    transform: [{ translateX: -4 }, { translateY: 0 }]
  },
});
