import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    ImageBackground,
    TouchableOpacity
} from "react-native";
import imageBck from '../assets/images/nuestros-cafes.png'
import { useNavigation } from "@react-navigation/native";

import { coffeeCategories } from "../data/CoffeesData";

const OurCoffees = () => {
    const navigation = useNavigation();
    return (
        <ImageBackground source={imageBck} style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title} >Nuestros Cafés</Text>

                <View style={styles.mosaic}>
                    {coffeeCategories.map((item, index) => (
                        <TouchableOpacity style={styles.card} key={index} onPress={() => navigation.navigate("Category", { category: item })}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.legend}>{item.legend}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </ImageBackground>
    )
};

export default OurCoffees

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover', // se ajusta al tamaño de pantalla
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100
    },
    title: {
        fontSize: 28,
        fontWeight: "500",
        fontFamily: 'Jost_600SemiBold',
        color: "#fff",
        textTransform: 'uppercase',
        textAlign: "center",
        marginBottom: 40,
        textShadowColor: "rgba(0, 0, 0, 0.54)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 6,
    },
    mosaic: {
        flexDirection: "column",
        gap: 16,
    },
    card: {
        backgroundColor: "rgba(0, 0, 0, 0.45)", // un poco de transparencia para leer bien el texto
        borderRadius: 12,
        padding: 16,
        backdropFilter: "blur(8px)",
    },
    cardTitle: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: "500",
        fontFamily: 'Jost_600SemiBold',
        textTransform: 'capitalize',
        color: "#fff",
        marginBottom: 8,
    },
    legend: {
        fontSize: 16,
        fontFamily: 'Jost_400Regular',
        textAlign: 'center',
        color: "#ccc",
    }
});