import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Obtiene todos los cafés que contienen el tag especificado
 * @param {string} tag - clave de la categoría (por ejemplo: "viajar" o "tesoros")
 * @returns {Promise<Array>} lista de cafés
 */
export const getCoffeesByTag = async (tag) => {
  try {
    const q = query(collection(db, "coffees"), where("tags", "array-contains", tag));
    const snapshot = await getDocs(q);
    const coffees = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return coffees;
  } catch (error) {
    console.error("❌ Error al obtener cafés:", error);
    return [];
  }
};