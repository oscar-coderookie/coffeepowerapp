// screens/EditCoffeeScreen.js
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert
} from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import CustomHeader from "../../components/CustomHeader";
import { useTheme } from "@react-navigation/native";
import ButtonGeneral from "../../components/ButtonGeneral";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { playSound } from "../../utils/soundPlayer";

export default function EditCoffeeScreen({ route, navigation }) {
    const { coffee } = route.params;
    const { colors } = useTheme();
    //simple fields:
    const [name, setName] = useState(coffee.name || "");
    const [description, setDescription] = useState(coffee.description || "");
    const [price, setPrice] = useState(coffee.price?.toString() || "");
    const [image, setImage] = useState(coffee.image || "");

    const [emotionalDescription, setEmotionalDescription] = useState(coffee.emotionalDescription || []);
    const [profile, setProfile] = useState(coffee.profile || []);
    const [tags, setTags] = useState(coffee.tags || []);
    const [tasteNotes, setTasteNotes] = useState(coffee.tasteNotes || []);

    const updateArrayItem = (array, setArray, index, value) => {
        const newArray = [...array];
        newArray[index] = value;
        setArray(newArray);
    };

    const addArrayItem = (array, setArray) => {
        setArray([...array, ""]);
    };

    const removeArrayItem = (array, setArray, index) => {
        const newArray = array.filter((_, i) => i !== index);
        setArray(newArray);
    };

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

    const handleUpdate = async () => {
        try {
            const coffeeRef = doc(db, "coffees", coffee.id)

            //protect fields :
            const updatedData = {
                name: name.trim(),
                description: description.trim(),
                image: image.trim(),
                price: parseFloat(price) || 0,
                emotionalDescription: emotionalDescription.filter((t) => t.trim() !== ""),
                profile: profile.filter((t) => t.trim() !== ""),
                tags: tags.filter((t) => t.trim() !== ""),
                tasteNotes: tasteNotes.filter((t) => t.trim() !== ""),
            };

            await updateDoc(coffeeRef, updatedData);

            Toast.show({
                type: "success",
                text1: "✅ Actualizado",
                text2: "Los datos del café se han actualizado.",
            });
            navigation.goBack();
        } catch (error) {
            console.error("Error al actualizar:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo actualizar el café.",
            });

        }
    };

    const renderArrayEditor = (label, array, setArray) => (

        <View style={styles.arrayContainer}>
            <Text style={[styles.label, { color: colors.text, textTransform: 'capitalize' }]}>{label}</Text>

            {array.map((item, index) => (
                <View key={index} style={styles.arrayItem}>
                    <TextInput
                        style={[
                            styles.input,
                            styles.textAreaSmall,
                            { backgroundColor: colors.background, color: colors.text },
                        ]}
                        value={item}
                        onChangeText={(text) => updateArrayItem(array, setArray, index, text)}
                        placeholder="Escribe una frase..."
                        multiline
                    />
                    <TouchableOpacity
                        onPress={() => removeArrayItem(array, setArray, index)}
                        style={[styles.trashButton, { borderColor: colors.text }]}
                    >
                        <MaterialIcons name="delete-outline" size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>
            ))}

            <TouchableOpacity
                onPress={() => addArrayItem(array, setArray)}
                style={[styles.addButton, { borderColor: colors.text }]}
            >
                <MaterialCommunityIcons
                    name="plus-circle-outline"
                    size={20}
                    color={colors.text}
                />
                <Text style={[styles.addText, { color: colors.text }]}>Añadir línea</Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <CustomHeader title={`Editar: ${coffee.name}`} showBack={true} />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.label, { color: colors.text }]}>Nombre:</Text>
                <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text, outlineColor: colors.text }]} value={name} onChangeText={setName} />

                <Text style={[styles.label, { color: colors.text }]}>Descripción:</Text>
                <TextInput
                    style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text, outlineColor: colors.text }]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <Text style={[styles.label, { color: colors.text }]}>Precio(Euros €):</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.background, color: colors.text, outlineColor: colors.text }]}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />

                <Text style={[styles.label, { color: colors.text }]}>URL de imagen:</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.background, color: colors.text, outlineColor: colors.text }]}
                    value={image}
                    onChangeText={setImage}
                    placeholder="https://..."
                />

                {/* Arrays */}
                {renderArrayEditor("Perfil sensorial:", profile, setProfile)}
                {renderArrayEditor("Descripción emocional:", emotionalDescription, setEmotionalDescription)}
                {renderArrayEditor("Notas de cata:", tasteNotes, setTasteNotes)}
                {renderArrayEditor("Etiquetas:", tags, setTags)}
                <ButtonGeneral onTouch={handleUpdate} text="guardar cambios" bckColor={colors.text} textColor={colors.background} />
                <TouchableOpacity
                    onPress={() => handleDeleteCoffee(coffee.id)}
                    style={{
                        padding: 10,
                        borderRadius: 40,
                        backgroundColor: "red",
                        marginLeft: 10,
                    }}
                >
                    <MaterialIcons name="delete" size={24} color={colors.background} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        padding: 10,
        paddingBottom: 50,
    },
    label: {
        marginTop: 15,
        fontFamily: "Jost_500Medium",
    },
    input: {
        padding: 12,
        borderRadius: 10,
        marginTop: 6,
        borderWidth: 0.5,
        borderColor: "#999",
        fontFamily: "Jost_400Regular",
    },
    textArea: {
        height: 80,
        textAlignVertical: "top",
    },
    arrayContainer: {
        marginTop: 14,
    },
    arrayItem: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    textAreaSmall: {
        flex: 1,
        minHeight: 50,
        textAlignVertical: "top",
    },
    trashButton: {
        marginLeft: 8,
        padding: 6,
        borderRadius: 10,
        borderWidth: 0.5,
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        borderWidth: 0.5,
        borderRadius: 10,
        padding: 8,
        alignSelf: "flex-start",
    },
    addText: {
        marginLeft: 6,
        fontFamily: "Jost_400Regular",
    },
});