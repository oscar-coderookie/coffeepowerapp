// screens/AdminCatalogScreen.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
} from "react-native";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import Loader from "../../components/LoadingScreen";
import CustomHeader from "../../components/CustomHeader";
import { useTheme } from "@react-navigation/native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";


export default function AdminCatalogScreen({ navigation }) {
    const [coffees, setCoffees] = useState([]);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();

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
    //function for erase coffee:
    const handleDeleteCoffee = (coffeeId) => {
        Alert.alert(
            "Confirmar eliminación",
            "¿Seguro que quieres eliminar este café?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const coffeeRef = doc(db, "coffees", coffeeId);
                            await deleteDoc(coffeeRef);
                            Alert.alert("Café eliminado correctamente ✅");
                        } catch (error) {
                            console.error("Error al eliminar café:", error);
                            Alert.alert("Error", "No se pudo eliminar el café ❌");
                        }
                    },
                },
            ]
        );
    };



    if (loading) return <Loader message="Cargando catálogo..." />;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <CustomHeader title="Listado de Cafés: Modo editor" />
            <FlatList
                data={coffees}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View
                        style={[styles.card, { backgroundColor: colors.card }]}
                    >
                        <View style={styles.info}>
                            <Text style={[styles.title, { color: colors.text }]}>{item.name}</Text>
                            <Text style={[styles.price, { color: colors.text }]}>{item.price} €</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate("EditCoffee", { coffee: item })} style={{ padding: 10, borderRadius: 10, backgroundColor: 'green' }}>
                            <MaterialIcons name="mode-edit" size={24} color={colors.background} />
                        </TouchableOpacity>
                        <TouchableOpacity   onPress={() => handleDeleteCoffee(item.id)} style={{ padding: 10, borderRadius: 10, backgroundColor: 'red', marginLeft: 10 }}>
                            <MaterialIcons name="delete" size={24} color={colors.background} />
                        </TouchableOpacity>
                    </View>
                )}

            />

            <TouchableOpacity onPress={() => navigation.navigate("AddCoffee")} style={{ alignItems: 'center', paddingVertical: 20, flexDirection: 'row', justifyContent: 'center' }}>
                <FontAwesome name="plus-circle" size={30} color="black" />
                <Text style={{ fontFamily: 'Jost_600SemiBold', marginLeft: 10, textTransform: 'uppercase', width: 'auto' }}>Agregar Café nuevo</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    list: {
        padding: 10,


    },
    card: {
        flexDirection: "row",
        backgroundColor: "#1a1a1a",
        borderRadius: 14,

        padding: 12,
        marginBottom: 10,
        alignItems: "center",
        elevation: 2,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 12,
        marginRight: 15,
    },
    info: {
        flex: 1,
    },
    title: {
        color: "#fff",
        fontFamily: "Jost_400Regular",
        textTransform: 'capitalize'
    },
    price: {
        fontFamily: "Jost_600SemiBold",
        marginTop: 6,
    },
});
