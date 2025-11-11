import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export const useFavoriteCoffees = (favoriteIds = []) => {
  const [favoriteCoffees, setFavoriteCoffees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!favoriteIds || favoriteIds.length === 0) {
      setFavoriteCoffees([]);
      setLoading(false);
      return;
    }

    const fetchCoffees = async () => {
      setLoading(true);
      try {
        const coffees = await Promise.all(
          favoriteIds.map(async (id) => {
            const docSnap = await getDoc(doc(db, "coffees", id));
            if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
            return null;
          })
        );
        setFavoriteCoffees(coffees.filter(Boolean));
      } catch (e) {
        console.error("Error cargando cafés favoritos:", e);
      }
      setLoading(false);
    };

    fetchCoffees();
  }, [favoriteIds]);

  return { favoriteCoffees, loading };
};
