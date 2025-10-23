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
import imageBck from "../assets/images/nuestros-cafes.png";
import { coffeeCategories, coffeesCatalogue } from "../data/CoffesCategories";
import SearchBar from "../components/SearchBar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase"; // tu config ya inicializada

const OurCoffees = () => {
    const navigation = useNavigation();
    const [searchResults, setSearchResults] = useState([]);
    const [coffees, setCoffees] = useState([]);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };

        fetchCoffees();
    }, []);

    const handleSearch = (query) => {
        if (!query) {
            setSearchResults([]);
            return;
        }

        const filtered = coffees.filter((coffee) => {
            const lowerQuery = query.toLowerCase();

            // Buscar por nombre
            const matchName = coffee.name?.toLowerCase().includes(lowerQuery);

            // Buscar por descripción
            const matchDescription = coffee.description?.toLowerCase().includes(lowerQuery);

            // Buscar por tags
            const matchTags = coffee.tags?.some((tag) =>
                tag.toLowerCase().includes(lowerQuery)
            );

            return matchName || matchDescription || matchTags;
        });

        setSearchResults(filtered);
    };

    return (
        <View style={{ flex: 1 }}>
            <SearchBar onSearch={handleSearch} />
            <ImageBackground source={imageBck} style={styles.background}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {searchResults.length > 0 ? (
                        <>
                            <Text style={styles.title}>Resultados de búsqueda</Text>
                            <View style={styles.mosaic}>
                                {searchResults.map((coffee, index) => (
                                    <TouchableOpacity
                                        key={index} // ✅ key único por cada café
                                        style={styles.card}
                                        onPress={() =>
                                            navigation.navigate("CoffeeDetail", { coffee })
                                        }
                                    >
                                        <Text style={styles.cardTitle}>{coffee.name}</Text>

                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    ) : (
                    <>
                        <Text style={styles.title}>Nuestros Cafés</Text>
                        <View style={styles.mosaic}>
                            {coffeeCategories.map((item, index) => (
                                <TouchableOpacity
                                    key={index} // ✅ key único por cada categoría
                                    style={styles.card}
                                    onPress={() =>
                                        navigation.navigate("Category", { category: item })
                                    }
                                >
                                    <Text style={styles.cardTitle}>{item.name}</Text>
                                    {item.legend && (
                                        <Text style={styles.legend}>{item.legend}</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                    )}
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

export default OurCoffees;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    title: {
        fontSize: 24,
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
        gap: 16,
    },
    card: {
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        borderRadius: 12,
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
        color: "#ccc",
    },
});
