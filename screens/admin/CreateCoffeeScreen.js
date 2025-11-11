// screens/CreateCoffeeScreen.js
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db, storage, auth } from "../../config/firebase";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/CustomHeader";
import ButtonGeneral from "../../components/ButtonGeneral";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import Toast from "react-native-toast-message";

export default function CreateCoffeeScreen({ navigation }) {
    const { colors } = useTheme();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");

    const [emotionalDescription, setEmotionalDescription] = useState([]);
    const [profile, setProfile] = useState([]);
    const [tags, setTags] = useState([]);
    const [tasteNotes, setTasteNotes] = useState([]);



    // 🧩 Subir imagen a Firebase Storage
    const pickAndUploadImage = async (setImageUrl) => {
        try {
            // ✅ Pedir permisos
            const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!granted) {
                Alert.alert("Permiso denegado", "Debes permitir acceso a la galería.");
                return;
            }

            // ✅ Abrir galería (API actualizada)
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"], // ← ya no usa MediaTypeOptions
                quality: 1,
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            const { uri } = asset;

            // ✅ Validar formato PNG (por extensión)
            if (!uri.toLowerCase().endsWith(".png")) {
                Alert.alert("Formato no permitido", "Solo se aceptan imágenes PNG.");
                return;
            }

            // ✅ Convertir a blob y subir a Firebase
            const response = await fetch(uri);
            const blob = await response.blob();

            const imageId = uuid.v4();
            const imageRef = ref(storage, `cafes/empaques/${imageId}.png`);

            await uploadBytes(imageRef, blob, { contentType: "image/png" });

            const downloadURL = await getDownloadURL(imageRef);
            setImageUrl(downloadURL);

            Alert.alert("✅ Imagen subida correctamente");
        } catch (error) {
            console.error("Error subiendo imagen:", error);
            Alert.alert("Error", "No se pudo subir la imagen.");
        }
    };

    const deleteImage = async () => {
        try {
            if (!image) return;

            // Eliminar del storage
            const storageRef = ref(storage, image);
            await deleteObject(storageRef);

            setImage("");
            Alert.alert("Imagen eliminada", "La imagen ha sido eliminada correctamente.");
        } catch (error) {
            console.error("Error eliminando imagen:", error);
            setImage(""); // limpia el estado si el ref no existe
        }
    };

    const handleCreate = async () => {
        if (!name || !description || !price || !image) {
            return Alert.alert("Campos incompletos", "Por favor, rellena todos los campos.");
        }

        try {
            await addDoc(collection(db, "coffees"), {
                name: name.trim(),
                description: description.trim(),
                price: parseFloat(price) || 0,
                image: image.trim(),
                emotionalDescription: emotionalDescription.filter(t => t.trim() !== ""),
                profile: profile.filter(t => t.trim() !== ""),
                tags: tags.filter(t => t.trim() !== ""),
                tasteNotes: tasteNotes.filter(t => t.trim() !== ""),
                createdAt: new Date(),
            });
            Toast.show({
                type: "success",
                text1: "☕ Café creado",
                text2: "El nuevo café se ha agregado correctamente.",
            });
            navigation.goBack();
        } catch (error) {
            console.error("Error creando café:", error);
               Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo crear el café.",
            });
        }
    };

    const renderArrayEditor = (label, array, setArray) => (
        <View style={styles.arrayContainer}>
            <Text style={[styles.label, { color: colors.text, textTransform: "capitalize" }]}>{label}</Text>
            {array.map((item, index) => (
                <View key={index} style={styles.arrayItem}>
                    <TextInput
                        style={[
                            styles.input,
                            styles.textAreaSmall,
                            { backgroundColor: colors.background, color: colors.text },
                        ]}
                        value={item}
                        onChangeText={(text) => {
                            const newArray = [...array];
                            newArray[index] = text;
                            setArray(newArray);
                        }}
                        placeholder="Escribe una frase..."
                        multiline
                    />
                    <TouchableOpacity
                        onPress={() => setArray(array.filter((_, i) => i !== index))}
                        style={[styles.trashButton, { borderColor: colors.text }]}
                    >
                        <MaterialIcons name="delete-outline" size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>
            ))}
            <TouchableOpacity
                onPress={() => setArray([...array, ""])}
                style={[styles.addButton, { borderColor: colors.text }]}
            >
                <MaterialCommunityIcons name="plus-circle-outline" size={20} color={colors.text} />
                <Text style={[styles.addText, { color: colors.text }]}>Añadir línea</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <CustomHeader title="Crear nuevo café" showBack={true} />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.label, { color: colors.text }]}>Nombre:</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                    value={name}
                    onChangeText={setName}
                />

                <Text style={[styles.label, { color: colors.text }]}>Descripción:</Text>
                <TextInput
                    style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text }]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <Text style={[styles.label, { color: colors.text }]}>Precio (€):</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />

                <View>
                    <Text style={[styles.label, { color: colors.text }]}>Subir imagen (empaque):</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: '100%' }}>
                        <TouchableOpacity
                            onPress={image ? deleteImage : () => pickAndUploadImage(setImage)}
                            style={[
                                styles.uploadButton,
                                { backgroundColor: image ? "#c0392b" : colors.text, marginRight: 10 },
                            ]}
                        >
                            <MaterialIcons
                                name={image ? "delete" : "upload"}
                                size={22}
                                color={colors.background}
                            />
                        </TouchableOpacity>

                        <TextInput
                            style={[
                                styles.input,
                                {
                                    flex: 1,
                                    backgroundColor: colors.background,
                                    color: colors.text,
                                },
                            ]}
                            value={image}
                            editable={false}
                            placeholder="https://..."
                        />
                    </View>

                    {image ? (
                        <Image
                            source={{ uri: image }}
                            style={{ width: 100, height: 100, marginTop: 10, alignSelf: "center" }}
                        />
                    ) : null}
                </View>

                {renderArrayEditor("Perfil sensorial:", profile, setProfile)}
                {renderArrayEditor("Descripción emocional:", emotionalDescription, setEmotionalDescription)}
                {renderArrayEditor("Notas de cata:", tasteNotes, setTasteNotes)}
                {renderArrayEditor("Etiquetas:", tags, setTags)}

                <ButtonGeneral
                    onTouch={handleCreate}
                    text="Crear café"
                    bckColor={colors.text}
                    textColor={colors.background}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 10, paddingBottom: 50 },
    label: { marginTop: 15, fontFamily: "Jost_500Medium", marginBottom: 4 },
    input: {
        padding: 12,
        borderRadius: 10,

        borderWidth: 0.5,
        borderColor: "#999",
        fontFamily: "Jost_400Regular",
    },
    textArea: { height: 80, textAlignVertical: "top" },
    arrayContainer: { marginTop: 14 },
    arrayItem: { flexDirection: "row", alignItems: "center", marginTop: 6 },
    textAreaSmall: { flex: 1, minHeight: 50, textAlignVertical: "top" },
    trashButton: { marginLeft: 8, padding: 6, borderRadius: 10, borderWidth: 0.5 },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        borderWidth: 0.5,
        borderRadius: 10,
        padding: 8,
        alignSelf: "flex-start",
    },
    addText: { marginLeft: 6, fontFamily: "Jost_400Regular" },
    uploadButton: {
        padding: 10,
        borderWidth: 0.5,
        borderRadius: 10,

    },
});
