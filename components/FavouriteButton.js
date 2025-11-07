import React, { useContext, useState } from "react";
import { TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { FavoritesContext } from "../context/FavoritesContext";
import { isDeletingAccount } from "../utils/deleteAccount";
import { playSound } from "../utils/soundPlayer";
import Toast from "react-native-toast-message";

export default function FavouriteButton({ cafe, size = 26, color = "#FFD700" }) {
  const { favorites } = useContext(FavoritesContext);
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  // 🔹 Si no hay usuario logueado o café, no renderizamos nada
  if (!user || !cafe) return null;

  const cafeName = cafe.name || cafe.nombre;
  const cafeDesc = cafe.description || cafe.descripcion || "";
  const cafeImage = cafe.image || cafe.imagen || "";

  const isFavorite = favorites?.some(
    (fav) => fav.nombre?.toLowerCase() === cafeName?.toLowerCase()
  );

  const toggleFavorite = async () => {
    if (!cafeName) return;

    // 🚫 Bloquear acción si se está eliminando la cuenta
    if (isDeletingAccount) {
      Toast.show({
        type: "error",
        text1: "Cuenta en eliminación",
        text2: "Tu cuenta está siendo eliminada. No puedes modificar tus favoritos ahora.",
      });
      return;
    }

    // 🔸 Evitamos acción si el usuario no tiene sesión
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Inicia sesión",
        text2: "Por favor inicia sesión para guardar tus favoritos.",
      });
      return;
    }

    setLoading(true);

    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      // 🚫 Si el documento no existe, no lo creamos vacío
      if (!snap.exists()) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "El usuario no se ha registrado aun en la app, no se puede agregar a favoritos.",
        });
        setLoading(false);
        return;
      }

      const data = snap.data() || {};
      const currentFavs = data.favorites || [];

      let updatedFavs;

      if (isFavorite) {
        // 🧹 Eliminar si ya está en favoritos

        updatedFavs = currentFavs.filter(
          (f) => f.nombre?.toLowerCase() !== cafeName.toLowerCase()
        );
        playSound('click')
        // 🔔 Mostrar toast de eliminación
        Toast.show({
          type: "error",
          text1: cafeName,
          text2: "Eliminado de tu lista de favoritos.",
        });
      } else {
        // ✨ Agregar si no existe todavía
        const exists = currentFavs.some(
          (f) => f.nombre?.toLowerCase() === cafeName.toLowerCase()
        );
        playSound('favorite')
        Toast.show({
          type: "success",
          text1: cafeName,
          text2: "Correctamente añadido a favoritos",
        });
        if (!exists) {
          updatedFavs = [
            ...currentFavs,
            {
              nombre: cafeName,
              descripcion: cafeDesc,
              image: cafeImage,
            },
          ];
        } else {
          updatedFavs = currentFavs;
        }
      }
      await updateDoc(userRef, { favorites: updatedFavs });

    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Sucedio un error inesperado, recarga e intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity style={{ marginLeft: 10 }} onPress={toggleFavorite} disabled={loading}>
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Icon
          name={isFavorite ? "star" : "star-o"}
          size={size}
          color={color}
        />
      )}
    </TouchableOpacity>
  );
}
