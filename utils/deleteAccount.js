import { Alert } from "react-native";
import { auth, db } from "../config/firebase";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";

export const useDeleteAccount = () => {
  const deleteAccount = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "No hay usuario autenticado.");
      return;
    }

    // ⚠️ Pedimos la contraseña al usuario antes de eliminar
    return new Promise((resolve, reject) => {
      Alert.prompt(
        "Confirmar contraseña",
        "Por seguridad, ingresa tu contraseña para eliminar la cuenta:",
        [
          { text: "Cancelar", style: "cancel", onPress: reject },
          {
            text: "Confirmar",
            onPress: async (password) => {
              try {
                // 1️⃣ Reautenticación
                const credential = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, credential);

                // 2️⃣ Eliminar documento de Firestore
                const userRef = doc(db, "users", user.uid);
                await deleteDoc(userRef);

                // 3️⃣ Eliminar cuenta del Auth
                await deleteUser(user);

                Alert.alert("Cuenta eliminada", "Tu cuenta ha sido borrada exitosamente.");
                resolve();
              } catch (error) {
                console.log("Error eliminando cuenta:", error);
                if (error.code === "auth/wrong-password") {
                  Alert.alert("Contraseña incorrecta", "La contraseña ingresada no es válida.");
                } else if (error.code === "auth/requires-recent-login") {
                  Alert.alert(
                    "Inicio de sesión requerido",
                    "Por seguridad, vuelve a iniciar sesión antes de eliminar tu cuenta."
                  );
                } else {
                  Alert.alert("Error", "No se pudo eliminar la cuenta.");
                }
                reject(error);
              }
            },
          },
        ],
        "secure-text" // 🔒 para ocultar la contraseña en el prompt
      );
    });
  };

  return { deleteAccount };
};
