import { Text, View } from "react-native";
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

const UserSettings = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState("");
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);

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

      {/* Botón mostrar formulario cambiar correo */}
      <ButtonGeneral
        text={showChangeEmail ? "Cancelar" : "Cambiar correo notificaciones"}
        onTouch={() => setShowChangeEmail(!showChangeEmail)}
        bckColor={colors.text}
        marginHorizontal={10}
        textColor={colors.background}
      />

      {/* Formulario cambiar correo */}
      {showChangeEmail && (
        <ChangeEmailDirect
          currentEmail={notificationEmail} // pasamos el correo actual
          onSuccess={() => setShowChangeEmail(false)}
        />
      )}
    </View>
  );
};

export default UserSettings;
