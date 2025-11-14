import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import imageBck from "../assets/images/nuestros-cafes.jpg";
import { coffeeCategories } from "../data/CoffesCategories";
import SearchBar from "../components/SearchBar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { playSound } from "../utils/soundPlayer";
import CustomHeader from "../components/CustomHeader";

const OurCoffees = () => {
  const navigation = useNavigation();
  const [searchResults, setSearchResults] = useState([]);
  const [coffees, setCoffees] = useState([]);

  // --- Obtener cafés de Firestore ---
  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        const snapshot = await getDocs(collection(db, "coffees"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCoffees(data);
      } catch (error) {
        console.error("❌ Error trayendo cafés:", error);
      }
    };

    fetchCoffees();
  }, []);

  // --- Lógica de búsqueda ---
  const handleSearch = (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    const filtered = coffees.filter((coffee) => {
      const lowerQuery = query.toLowerCase();

      const matchName = coffee.name?.toLowerCase().includes(lowerQuery);
      const matchDescription = coffee.description?.toLowerCase().includes(lowerQuery);
      const matchTags = coffee.tags?.some((tag) =>
        tag.toLowerCase().includes(lowerQuery)
      );

      return matchName || matchDescription || matchTags;
    });

    setSearchResults(filtered);
  };

  // --- Componente con animación ---
  const AnimatedCard = ({ index, children, onPress }) => {
    const [pressed, setPressed] = useState(false);

    return (
      <MotiView
        from={{ opacity: 0, translateY: 25 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: index * 120, type: "timing", duration: 500 }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={onPress}
        >
          <MotiView
            animate={{ scale: pressed ? 0.96 : 1 }}
            transition={{ type: "spring", damping: 15 }}
          >
            {children}
          </MotiView>
        </TouchableOpacity>
      </MotiView>
    );
  };

  // --- Render principal ---
  return (
<>
<CustomHeader title='nuestros cafés' />
<ImageBackground source={imageBck} style={styles.background}>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <SearchBar onSearch={handleSearch} />
        {searchResults.length > 0 ? (
          <>
            <Text style={styles.title}>Resultados de búsqueda</Text>
            <View style={styles.mosaic}>
              {searchResults.map((coffee, index) => (
                <AnimatedCard
                  key={coffee.id || index}
                  index={index}
                  onPress={() => navigation.navigate("CoffeeDetail", { coffee })}
                >
                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>{coffee.name}</Text>
                  </View>
                </AnimatedCard>
              ))}
            </View>
          </>
        ) : (
          <>

            <View style={styles.mosaic}>
              {coffeeCategories.map((item, index) => (
                <AnimatedCard
                  key={item.id || index}
                  index={index}
                  onPress={() => {
                    playSound("click");
                    navigation.navigate("Category", { category: item });
                  }}
                >
                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    {item.legend && <Text style={styles.legend}>{item.legend}</Text>}
                  </View>
                </AnimatedCard>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </ImageBackground>
</>
    

  );
};

export default OurCoffees;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    height: "100%"
  },
  scrollContent: {
    padding: 10,
    paddingBottom: 100,
  },
  title: {
    fontSize: 30,
    fontFamily: "Jost_600SemiBold",
    color: "#fff",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.54)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 6,
  },
  mosaic: {
    flexDirection: "column",
    gap: 10,
  },
  card: {
    backgroundColor: "rgba(0, 0, 0, 0.43)",
    borderRadius: 60,
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Jost_600SemiBold",
    color: "#fff",
    marginBottom: 8,
  },
  legend: {
    fontSize: 16,
    fontFamily: "Jost_400Regular",
    textAlign: "center",
    color: "#ffffffff",
  },
});
