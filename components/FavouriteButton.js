import React, { useContext, useState } from "react";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { FavoritesContext } from "../context/FavoritesContext";
import { auth } from "../config/firebase";
import { playSound } from "../utils/soundPlayer";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export default function FavouriteButton({ cafe, size = 26, color = "#FFD700" }) {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;
  if (!user || !cafe) return null;

  const cafeId = cafe.id;
  const cafeName = cafe.name || cafe.nombre;

  // ✔ Comparar por id dentro de los objetos
  const isFavorite = favorites.some((fav) => fav.id === cafeId);

  const handlePress = async () => {
    if (!cafeId) return;

    setLoading(true);

    try {
      // ✔ Enviar el café completo
      const result = await toggleFavorite(cafe);

      if (result.added) {
        playSound("favorite");
        Toast.show({
          type: "success",
          text1: cafeName,
          text2: "Añadido correctamente a favoritos.",
        });
      } else {
        playSound("click");
        Toast.show({
          type: "error",
          text1: cafeName,
          text2: "Eliminado de tus favoritos.",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Algo salió mal, intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

 return (
  <TouchableOpacity onPress={handlePress} disabled={loading}>
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Ionicons
          name={isFavorite ? "heart-sharp" : "heart-outline"}
          size={size}
          color={color}
        />
      )}
    </View>
  </TouchableOpacity>
);
}
