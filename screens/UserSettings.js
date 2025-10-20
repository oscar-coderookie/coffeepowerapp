import { Alert, Text, TextInput, View } from "react-native";
import ButtonGeneral from "../components/ButtonGeneral";
import ConfirmDeleteModal from "../components/DeleteModal";
import { useState, useEffect, useContext } from "react";
import { useTheme } from "@react-navigation/native";
import ChangePasswordDirect from "../components/ChangePass";
import CustomHeader from "../components/CustomHeader";
import ChangeEmailDirect from "../components/ChangeEmailDirect";
import { AuthContext } from "../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import PassInput from "../components/PassInput";

const UserSettings = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChange2Email, setShowChange2Email] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const { colors } = useTheme();
  const { user, changeEmail } = useContext(AuthContext);

  // 🔹 Escuchar cambios en Firestore para el correo de notificaciones
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setNotificationEmail(docSnap.data().email); // email de notificaciones
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

      {/* Botón eliminar cuenta */}
      <ButtonGeneral
        text="Eliminar cuenta"
        onTouch={() => setModalVisible(true)}
        bckColor="red"
        marginHorizontal={10}
        textColor="white"
      />
      <ConfirmDeleteModal isVisible={modalVisible} onClose={() => setModalVisible(false)} />

      {/* Botón mostrar formulario cambiar contraseña */}
      <ButtonGeneral
        text={showChangePassword ? "Cancelar" : "Cambiar contraseña"}
        onTouch={() => setShowChangePassword(!showChangePassword)}
        bckColor={colors.text}
        marginHorizontal={10}
        textColor={colors.background}
      />

      {/* Formulario cambiar contraseña */}
      {showChangePassword && (
        <ChangePasswordDirect onSuccess={() => setShowChangePassword(false)} />
      )}
      {showChange2Email && (
        <View style={{ marginHorizontal: 10 }}>
          <TextInput
            placeholder="Nuevo correo"
            value={newEmail}
            onChangeText={setNewEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <PassInput
            password={currentPassword}
            setPassword={setCurrentPassword} />
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
