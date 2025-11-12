// screens/CreateCoffeeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { db } from "../../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import CustomHeader from "../../components/CustomHeader";

const CreateCoffeeScreen = ({ navigation }) => {
  const [coffeeData, setCoffeeData] = useState({
    name: "",
    quantity: "",
    description: "",
    image: "",
    url: "",
    tags: "",
    background: "",
    profile: "",
    tasteNotes: "",
    emotionalDescription: "",
    price: "",
  });

  const handleChange = (field, value) => {
    setCoffeeData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    try {
      // Transformar los campos de texto en arrays si tienen contenido
      const toArray = (text) =>
        text && text.trim() !== ""
          ? text.split("\n").filter((line) => line.trim() !== "")
          : [];

      const newCoffee = {
        name: coffeeData.name || "",
        quantity: Number(coffeeData.quantity) || 1,
        description: coffeeData.description || "",
        image: coffeeData.image || "",
        url: coffeeData.url || "",
        tags: coffeeData.tags
          ? coffeeData.tags.split(",").map((tag) => tag.trim())
          : [],
        background: coffeeData.background || "",
        profile: toArray(coffeeData.profile),
        tasteNotes: toArray(coffeeData.tasteNotes),
        emotionalDescription: toArray(coffeeData.emotionalDescription),
        price: Number(coffeeData.price) || 0,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "coffees"), newCoffee);
      Toast.show({
        type: "success",
        text1: "✅ Café creado",
        text2: "Ahora puedes editarlo con más detalle.",
      });
      navigation.navigate("EditCoffeeScreen", { id: docRef.id });
    } catch (error) {
      console.error("Error al crear café:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo crear el café. Intenta de nuevo.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Nuevo Café" />
      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          placeholder="Nombre"
          placeholderTextColor="#999"
          style={styles.input}
          value={coffeeData.name}
          onChangeText={(text) => handleChange("name", text)}
        />
        <TextInput
          placeholder="Cantidad (por defecto 1)"
          placeholderTextColor="#999"
          keyboardType="numeric"
          style={styles.input}
          value={coffeeData.quantity}
          onChangeText={(text) => handleChange("quantity", text)}
        />
        <TextInput
          placeholder="Descripción"
          placeholderTextColor="#999"
          style={[styles.input, { height: 80, textAlignVertical: "top" }]}
          multiline
          value={coffeeData.description}
          onChangeText={(text) => handleChange("description", text)}
        />
        <TextInput
          placeholder="URL de imagen"
          placeholderTextColor="#999"
          style={styles.input}
          value={coffeeData.image}
          onChangeText={(text) => handleChange("image", text)}
        />
        <TextInput
          placeholder="Fondo (background)"
          placeholderTextColor="#999"
          style={styles.input}
          value={coffeeData.background}
          onChangeText={(text) => handleChange("background", text)}
        />
        <TextInput
          placeholder="URL interna (/nuestroscafes/... )"
          placeholderTextColor="#999"
          style={styles.input}
          value={coffeeData.url}
          onChangeText={(text) => handleChange("url", text)}
        />
        <TextInput
          placeholder="Tags (separados por comas)"
          placeholderTextColor="#999"
          style={styles.input}
          value={coffeeData.tags}
          onChangeText={(text) => handleChange("tags", text)}
        />
        <TextInput
          placeholder="Perfil (una línea por frase)"
          placeholderTextColor="#999"
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          multiline
          value={coffeeData.profile}
          onChangeText={(text) => handleChange("profile", text)}
        />
        <TextInput
          placeholder="Notas de sabor (una línea por frase)"
          placeholderTextColor="#999"
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          multiline
          value={coffeeData.tasteNotes}
          onChangeText={(text) => handleChange("tasteNotes", text)}
        />
        <TextInput
          placeholder="Descripción emocional (una línea por frase)"
          placeholderTextColor="#999"
          style={[styles.input, { height: 120, textAlignVertical: "top" }]}
          multiline
          value={coffeeData.emotionalDescription}
          onChangeText={(text) =>
            handleChange("emotionalDescription", text)
          }
        />
        <TextInput
          placeholder="Precio (€)"
          placeholderTextColor="#999"
          keyboardType="numeric"
          style={styles.input}
          value={coffeeData.price}
          onChangeText={(text) => handleChange("price", text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Crear Café</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreateCoffeeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
  },
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 12,
    fontFamily: "Jost_400Regular",
  },
  button: {
    backgroundColor: "#c49b63",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Jost_600SemiBold",
    fontSize: 16,
  },
});
