import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Alert,
} from "react-native";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import LoadingScreen from "../../components/LoadingScreen";
import CustomHeader from "../../components/CustomHeader";
import { useTheme } from "@react-navigation/native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { playSound } from "../../utils/soundPlayer";
import Toast from "react-native-toast-message";

export default function AdminCatalogScreen({ navigation }) {
    const [coffees, setCoffees] = useState([]);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();
    const animations = useRef([]).current;

    // 🔹 Escuchar colección de cafés
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "coffees"), (snapshot) => {
            const list = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCoffees(list);
            setLoading(false);
        });
        return unsubscribe;
    }, []);
    //react hook para animaciones:
    useEffect(() => {
        // Ajustar tamaño del array
        if (animations.length !== coffees.length) {
            animations.length = coffees.length;
        }

        // Crear animaciones nuevas si faltan
        coffees.forEach((_, i) => {
            if (!animations[i]) {
                animations[i] = new Animated.Value(0);
            }
        });

        // Evitar crash si está vacío
        if (coffees.length === 0) return;

        // Ejecutar animaciones
        Animated.stagger(
            100,
            animations
                .slice(0, coffees.length)
                .map((anim) =>
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    })
                )
        ).start();
    }, [coffees]);

    // 🔹 Eliminar café
    const handleDeleteCoffee = (coffeeId) => {
        playSound('click')
        Alert.alert("Confirmar eliminación", "¿Seguro que quieres eliminar este café?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    try {
                        const coffeeRef = doc(db, "coffees", coffeeId);
                        await deleteDoc(coffeeRef);

                        Toast.show({
                            type: "error",
                            text1: "Eliminado",
                            text2: "Café eliminado correctamente de la base de datos✅",
                        });
                    } catch (error) {
                        console.error("Error al eliminar café:", error);
                        Toast.show({
                            type: "error",
                            text1: "Error",
                            text2: "No se pudo eliminar el café ❌",
                        })
                    }
                },
            },
        ]);
    };

    // 🔹 Render de cada item con animación individual
    const renderItem = ({ item, index }) => {
        if (!animations[index]) {
            animations[index] = new Animated.Value(0);
        }

        const anim = animations[index];


        const opacity = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });

        const translateY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0],
        });

        return (
            <Animated.View
                style={[
                    styles.card,
                    {
                        backgroundColor: colors.card,
                        opacity,
                        transform: [{ translateY }],
                    },
                ]}
            >
                <View style={styles.info}>
                    <Text style={[styles.title, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.price, { color: colors.text }]}>{item.price} €</Text>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        playSound('click')
                        navigation.navigate("EditCoffee", { coffee: item })
                    }}
                    style={{ padding: 10, borderRadius: 10, backgroundColor: "green" }}
                >
                    <MaterialIcons name="mode-edit" size={24} color={colors.background} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleDeleteCoffee(item.id)}
                    style={{
                        padding: 10,
                        borderRadius: 10,
                        backgroundColor: "red",
                        marginLeft: 10,
                    }}
                >
                    <MaterialIcons name="delete" size={24} color={colors.background} />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    if (loading) return <LoadingScreen message="Cargando catálogo..." />;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <CustomHeader title="Listado de Cafés: Modo editor" />

            <Animated.FlatList
                data={coffees}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
                onPress={() => {
                    playSound('click')
                    navigation.navigate("AddCoffee");
                }}
                style={styles.addButton}
            >
                <FontAwesome name="plus-circle" size={30} color={colors.text} />
                <Text style={[styles.addText, { color: colors.text }]}>Agregar Café nuevo</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    list: { padding: 10, paddingBottom: 80 },
    card: {
        flexDirection: "row",
        borderRadius: 14,
        padding: 10,
        marginBottom: 10,
        alignItems: "center",
        elevation: 2,
    },
    info: { flex: 1 },
    title: {
        fontFamily: "Jost_400Regular",
        textTransform: "capitalize",
    },
    price: {
        fontFamily: "Jost_600SemiBold",
        marginTop: 6,
    },
    addButton: {
        alignItems: "center",
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: "center",
    },
    addText: {
        fontFamily: "Jost_600SemiBold",
        marginLeft: 10,
        textTransform: "uppercase",
    },
});
