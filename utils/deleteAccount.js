import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext"; // ruta según tu proyecto
import { Alert } from "react-native";
import { auth, db } from "../config/firebase";
import { deleteUser } from "firebase/auth";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

export const useDeleteAccount = () => {
  const { setIsDeletingAccount } = useContext(FavoritesContext);

  const deleteAccount = () => {
    Alert.alert(
      "Eliminar cuenta",
      "¿Estás seguro de que deseas eliminar tu cuenta y todos tus datos personales? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) {
                Alert.alert("Error", "No hay una sesión activa.");
                return;
              }

              setIsDeletingAccount(true);

              const storage = getStorage();
              const userRef = doc(db, "users", user.uid);
              const userSnap = await getDoc(userRef);

              // 🔹 Si el usuario tiene avatar, eliminarlo del Storage
              if (userSnap.exists() && userSnap.data().avatar) {
                const avatarRef = ref(storage, `avatars/${user.uid}/avatar.jpg`);
                await deleteObject(avatarRef).catch(() =>
                  console.log("No se encontró avatar, continuando...")
                );
              }

              // 🔹 Eliminar documento del usuario
              await deleteDoc(userRef);

              // 🔹 Eliminar la cuenta en Firebase Authentication
              await deleteUser(user);

              Alert.alert(
                "Cuenta eliminada",
                "Tu cuenta y tus datos personales han sido eliminados correctamente."
              );
            } catch (error) {
              console.error("Error eliminando cuenta:", error);
              Alert.alert(
                "Error",
                "No se pudo eliminar tu cuenta. Es posible que debas volver a iniciar sesión antes de intentarlo nuevamente."
              );
            } finally {
              setIsDeletingAccount(false);
            }
          },
        },
      ]
    );
  };

  return { deleteAccount };
};
