import { Alert, Text, TextInput, View } from "react-native";
import ButtonGeneral from "../components/ButtonGeneral";
import ConfirmDeleteModal from "../components/DeleteModal";
import { useState, useEffect, useContext } from "react";
import { useTheme } from "@react-navigation/native";
import ChangePasswordDirect from "../components/ChangePass";
import CustomHeader from "../components/CustomHeader";
import PassInput from "../components/PassInput";
import { AuthContext } from "../context/AuthContext";
import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";

const UserSettings = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChange2Email, setShowChange2Email] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const { colors } = useTheme();
  const { user, changeEmail } = useContext(AuthContext);

  // ✅ Recibe la contraseña desde el modal
  const handleDeleteAccount = async (password) => {
    if (!password) {
      Alert.alert("Error", "Ingresa tu contraseña para confirmar.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "No hay usuario autenticado.");
      return;
    }

    try {
      // 1️⃣ Reautenticar usuario
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);

      // 2️⃣ Borrar documento del usuario
      await deleteDoc(doc(db, "users", currentUser.uid));

      // 3️⃣ Borrar cuenta del Auth
      await deleteUser(currentUser);

      // 4️⃣ Cerrar modal y confirmar
      setModalVisible(false);
      Alert.alert("Cuenta eliminada", "Tu cuenta ha sido eliminada exitosamente.");
    } catch (error) {
      console.error("❌ Error eliminando cuenta:", error);
      if (error.code === "auth/wrong-password") {
        Alert.alert("Contraseña incorrecta", "La contraseña ingresada no es válida.");
      } else if (error.code === "auth/requires-recent-login") {
        Alert.alert("Inicio de sesión requerido", "Vuelve a iniciar sesión antes de eliminar tu cuenta.");
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  // 🔹 Escuchar cambios en Firestore
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setNotificationEmail(docSnap.data().email);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleChangeEmail = async () => {
    if (!newEmail || !currentPassword) {
      Alert.alert("Error", "Debes completar todos los campos.");
      return;
    }

    const result = await changeEmail(newEmail, currentPassword);
    if (result.success) {
      Alert.alert("Éxito", result.message);
      setNewEmail("");
      setCurrentPassword("");
    } else {
      Alert.alert("Error", result.message);
    }
  };

  return (
    <View>
      <CustomHeader showBack={false} title="Ajustes:" />

      {/* 🗑 Botón eliminar cuenta */}
      <ButtonGeneral
        text="Eliminar cuenta"
        onTouch={() => setModalVisible(true)}
        bckColor="red"
        marginHorizontal={10}
        textColor="white"
      />

      <ConfirmDeleteModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleDeleteAccount} // ✅ ahora sí pasa la password
      />

      {/* 🔐 Cambiar contraseña */}
      <ButtonGeneral
        text={showChangePassword ? "Cancelar" : "Cambiar contraseña"}
        onTouch={() => setShowChangePassword(!showChangePassword)}
        bckColor={colors.text}
        marginHorizontal={10}
        textColor={colors.background}
      />
      {showChangePassword && <ChangePasswordDirect onSuccess={() => setShowChangePassword(false)} />}

      {/* ✉️ Cambiar correo */}
      {showChange2Email && (
        <View style={{ marginHorizontal: 10 }}>
          <TextInput
            placeholder="Nuevo correo"
            value={newEmail}
            onChangeText={setNewEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <PassInput password={currentPassword} setPassword={setCurrentPassword} />
          <ButtonGeneral
            text="Actualizar correo"
            bckColor={colors.text}
            textColor={colors.background}
            onTouch={handleChangeEmail}
          />
        </View>
      )}

      <ButtonGeneral
        text={showChange2Email ? "Cancelar" : "Cambiar correo registrado"}
        onTouch={() => setShowChange2Email(!showChange2Email)}
        bckColor={colors.text}
        marginHorizontal={10}
        textColor={colors.background}
      />
    </View>
  );
};

export default UserSettings;
