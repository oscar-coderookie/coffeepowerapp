import { Alert, Text, TextInput, View, ScrollView } from "react-native";
import ButtonGeneral from "../../components/ButtonGeneral";
import ConfirmDeleteModal from "../../components/DeleteModal";
import { useState, useEffect, useContext } from "react";
import { useTheme } from "@react-navigation/native";
import ChangePasswordDirect from "../../components/ChangePass";
import CustomHeader from "../../components/CustomHeader";
import PassInput from "../../components/PassInput";
import { AuthContext } from "../../context/AuthContext";
import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";
import { MotiView } from "moti"; // 👈 animaciones

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
    if (!password) return Alert.alert("Error", "Ingresa tu contraseña para confirmar.");

    const currentUser = auth.currentUser;
    if (!currentUser) return Alert.alert("Error", "No hay usuario autenticado.");

    try {
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      await deleteDoc(doc(db, "users", currentUser.uid));
      await deleteUser(currentUser);
      setModalVisible(false);
      Alert.alert("Cuenta eliminada", "Tu cuenta ha sido eliminada exitosamente.");
    } catch (error) {
      console.error("❌ Error eliminando cuenta:", error);
      if (error.code === "auth/wrong-password")
        Alert.alert("Contraseña incorrecta", "La contraseña ingresada no es válida.");
      else if (error.code === "auth/requires-recent-login")
        Alert.alert("Inicio de sesión requerido", "Vuelve a iniciar sesión antes de eliminar tu cuenta.");
      else Alert.alert("Error", error.message);
    }
  };

  // 🔹 Escuchar cambios en Firestore
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) setNotificationEmail(docSnap.data().email);
    });
    return () => unsubscribe();
  }, [user]);

  const handleChangeEmail = async () => {
    if (!newEmail || !currentPassword)
      return Alert.alert("Error", "Debes completar todos los campos.");

    const result = await changeEmail(newEmail, currentPassword);
    if (result.success) {
      Alert.alert("Éxito", result.message);
      setNewEmail("");
      setCurrentPassword("");
    } else Alert.alert("Error", result.message);
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader showBack={false} title="Ajustes:" />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ⚙️ Botones con animación escalonada */}
        <View style={{ marginTop: 10 }}>
          {[
            {
              key: "delete",
              text: "Eliminar cuenta",
              color: "red",
              textColor: "white",
              onTouch: () => setModalVisible(true),
            },
            {
              key: "changePass",
              text: showChangePassword ? "Cancelar" : "Cambiar contraseña",
              color: colors.text,
              textColor: colors.background,
              onTouch: () => setShowChangePassword(!showChangePassword),
            },
            {
              key: "changeEmail",
              text: showChange2Email ? "Cancelar" : "Cambiar correo registrado",
              color: colors.text,
              textColor: colors.background,
              onTouch: () => setShowChange2Email(!showChange2Email),
            },
          ].map((btn, index) => (
            <MotiView
              key={btn.key}
              from={{ opacity: 0, translateX: -50 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{
                type: "timing",
                duration: 600,
                delay: index * 150, // 👈 efecto escalonado
              }}
              style={{ marginBottom: 6 }}
            >
              <ButtonGeneral
                text={btn.text}
                onTouch={btn.onTouch}
                bckColor={btn.color}
                marginHorizontal={10}
                textColor={btn.textColor}
              />
            </MotiView>
          ))}
        </View>

        {/* 🔐 Cambiar contraseña */}
        {showChangePassword && (
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 400 }}
          >
            <ChangePasswordDirect onSuccess={() => setShowChangePassword(false)} />
          </MotiView>
        )}

        {/* ✉️ Cambiar correo */}
        {showChange2Email && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400 }}
            style={{ marginHorizontal: 10 }}
          >
            <TextInput
              placeholder="Nuevo correo"
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderColor: colors.text,
                borderRadius: 8,
                padding: 8,
                marginBottom: 10,
                color: colors.text,
              }}
            />
            <PassInput password={currentPassword} setPassword={setCurrentPassword} />
            <ButtonGeneral
              text="Actualizar correo"
              bckColor={colors.text}
              textColor={colors.background}
              onTouch={handleChangeEmail}
            />
          </MotiView>
        )}
      </ScrollView>

      <ConfirmDeleteModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleDeleteAccount}
      />
    </View>
  );
};

export default UserSettings;
