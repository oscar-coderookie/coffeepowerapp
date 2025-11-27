import { Alert } from "react-native";
import { auth, db } from "../config/firebase";
import { doc, setDoc, deleteDoc, addDoc, collection } from "firebase/firestore";
import Toast from "react-native-toast-message";

export const useAddresses = (
  addressId,
  address,
  setIsEditing,
  onUpdated,
  onDeleted
) => {

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      return Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debes iniciar sesión",
      });
    }

    try {
      if (!addressId) {
        // 🔥 CREAR NUEVA DIRECCIÓN
        await addDoc(collection(db, `users/${user.uid}/addresses`), address);

        Toast.show({
          type: "success",
          text1: "Dirección añadida",
          text2: "Nueva dirección guardada correctamente",
        });

        onUpdated?.();
        return;
      }

      // 🔥 EDITAR DIRECCIÓN EXISTENTE
      const ref = doc(db, `users/${user.uid}/addresses/${addressId}`);
      await setDoc(ref, address, { merge: true });

      Toast.show({
        type: "success",
        text1: "Guardado",
        text2: "Dirección actualizada correctamente",
      });

      setIsEditing(false);
      onUpdated?.();

    } catch (err) {
      console.log("Error guardando dirección:", err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo guardar la dirección",
      });
    }
  };

  const handleDelete = async () => {
    if (!addressId) return;

    const user = auth.currentUser;

    Alert.alert(
      "Eliminar dirección",
      "¿Estás seguro de eliminar esta dirección?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const ref = doc(db, `users/${user.uid}/addresses/${addressId}`);
              await deleteDoc(ref);

              onDeleted?.(addressId);

              Toast.show({
                type: "success",
                text1: "Eliminada",
                text2: "La dirección fue eliminada",
              });
            } catch (err) {
              console.log("Error eliminando dirección:", err);
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo eliminar la dirección",
              });
            }
          },
        },
      ]
    );
  };

  return { handleSave, handleDelete };
};
