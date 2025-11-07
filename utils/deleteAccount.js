import { Alert } from "react-native";
import { auth, db } from "../config/firebase";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import Toast from "react-native-toast-message";

export const useDeleteAccount = () => {
  const deleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No hay usuario autenticado.",
      });
      return;

    }

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
                const credential = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, credential);

                const userRef = doc(db, "users", user.uid);

                // 🔹 Eliminar subcolecciones antes del documento
                const subcollections = ["cart", "addresses", "orders"];
                for (const sub of subcollections) {
                  const subRef = collection(db, `users/${user.uid}/${sub}`);
                  const snapshot = await getDocs(subRef);
                  const batchDeletes = snapshot.docs.map((d) => deleteDoc(d.ref));
                  await Promise.all(batchDeletes);
                }

                // 🔹 Eliminar documento principal
                await deleteDoc(userRef);

                // 🔹 Finalmente, eliminar usuario de Auth
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
        "secure-text"
      );
    });
  };

  return { deleteAccount };
};
