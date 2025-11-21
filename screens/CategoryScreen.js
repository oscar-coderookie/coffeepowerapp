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
import SortToolCoffeePower from "../components/SortCoffees";
import SortButton from "../components/SortButton";

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
  const [sortVisible, setSortVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("az");
  const { colors } = useTheme();


  function applySort(type) {
    let sorted = [...coffees];

    switch (type) {
      case "az":
        sorted.sort((a, b) => a.name.localeCompare(b.nombre));
        break;
      case "za":
        sorted.sort((a, b) => b.name.localeCompare(a.nombre));
        break;
      case "short":
        sorted.sort((a, b) => a.name.length - b.nombre.length);
        break;
      case "long":
        sorted.sort((a, b) => b.name.length - a.nombre.length);
        break;
    }

    setCoffees(sorted);
    setSortType(type);
  };

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


      {loading ? (<LoadingScreen />
      ) : (
        <View style={[styles.overlay, { backgroundColor: colors.background }]}>
          <View
            style={{
              borderBottomColor: colors.border,
              borderBottomWidth: 0.5,
              marginBottom: 10,
              paddingHorizontal: 10,
              alignItems: "center", // centra verticalmente
              justifyContent: "center",
            }}
          >
            {category.legend && (
              <Text
                style={[
                  {
                    color: colors.text,
                    marginTop:10,
                    fontSize: 16,
                    fontFamily: 'Jost_600SemiBold',
                    textAlign: 'left', // ⚡ opcional: alinea a la izquierda para que ocupe todo el espacio
                  }
                ]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {category.legend}
              </Text>
            )}

            <SortButton
              onPress={() => setSortVisible(true)}
              sortType={sortType}
              style={{ marginLeft: 8 }} // un poquito de separación
            />
          </View>

          {/* MODAL DE SORT */}
          <SortToolCoffeePower
            visible={sortVisible}
            onClose={() => setSortVisible(false)}
            onSelect={applySort}
          />
          <FlatList
            data={coffees}
            keyExtractor={(item) => item.name.toUpperCase()}
            style={styles.flatList}
            contentContainerStyle={{ paddingBottom: 100, marginBottom:100 }}
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
                <LinearGradient
                  colors={[colors.card, colors.gray, colors.card]}
                  start={{ x: 0.3, y: 0 }}
                  style={[styles.card]}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      playSound('click');
                      navigation.navigate("CoffeeDetail", { coffee: item, coffeeId: item.id })
                    }}
                  >
                    <FavoriteButton cafe={item} size={40} color="red" />
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
                </LinearGradient>

              </MotiView>

            )}
          />
        </View>)}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: "cover" },
  overlay: { flex:1, paddingHorizontal: 10 },
  legend: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    paddingTop: 16,
    fontFamily: 'Jost_600SemiBold'
  },
  flatList: {
    flexGrow: 1,
    paddingTop: 10,
    paddingHorizontal: 4
  },
  card: {
    marginBottom: 14,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 42,
    padding: 6,
    shadowColor: "#000000ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 1,

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
    borderRadius: 36,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8
  },
  image: {
    width: "240%",
    height: "240%",
    transform: [{ translateX: -4 }, { translateY: 16 }]
  },
});
