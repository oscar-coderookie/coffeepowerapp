import React, { useContext, useState } from "react";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { FavoritesContext } from "../context/FavoritesContext";

export default function FavouriteButton({ cafe, size = 26, color = "#FFD700" }) {
  const { favorites } = useContext(FavoritesContext);
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  if (!user || !cafe) return null;

  const cafeName = cafe.name || cafe.nombre;
  const cafeDesc = cafe.description || cafe.descripcion || "";
  const cafeImage = cafe.image || cafe.imagen || "";

  const isFavorite = favorites?.some(
    (fav) => fav.nombre?.toLowerCase() === cafeName?.toLowerCase()
  );

  const toggleFavorite = async () => {
    if (!cafeName) return;
    setLoading(true);

    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      // Si el documento no existe aún
      if (!snap.exists()) {
        await setDoc(userRef, { favorites: [] });
      }

      const data = snap.data() || {};
      const currentFavs = data.favorites || [];

      let updatedFavs;

      if (isFavorite) {
        // 🧹 Eliminar si ya está
        updatedFavs = currentFavs.filter(
          (f) => f.nombre?.toLowerCase() !== cafeName.toLowerCase()
        );
      } else {
        // ✨ Agregar solo si no existe
        const exists = currentFavs.some(
          (f) => f.nombre?.toLowerCase() === cafeName.toLowerCase()
        );
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
      console.log("❌ Error actualizando favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity onPress={toggleFavorite} disabled={loading}>
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
