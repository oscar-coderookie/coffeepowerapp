import { TextInput, View, ScrollView } from "react-native";
import ButtonGeneral from "../../components/ButtonGeneral";
import ConfirmDeleteModal from "../../components/DeleteModal";
import { useState, useEffect, useContext } from "react";
import { useTheme } from "@react-navigation/native";
import ChangePasswordDirect from "../../components/ChangePass";
import CustomHeader from "../../components/CustomHeader";
import PassInput from "../../components/PassInput";
import { AuthContext } from "../../context/AuthContext";
import { collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";
import { MotiView } from "moti"; // 👈 animaciones
import { playSound } from "../../utils/soundPlayer";
import Toast from "react-native-toast-message";

const UserSettings = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChange2Email, setShowChange2Email] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const { colors } = useTheme();
  const { user, changeEmail, handleDeleteAccount } = useContext(AuthContext);

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
      return Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debes completar todos los campos.",
      });

    const result = await changeEmail(newEmail, currentPassword);
    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: result.message,
      })
      setNewEmail("");
      setCurrentPassword("");
    } else Toast.show({
      type: "error",
      text1: "Error",
      text2: result.message,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ⚙️ Botones con animación escalonada */}
        <View style={{ marginTop: 10 }}>
          {[
            {
              key: "delete",
              text: "Eliminar cuenta",
              borderColor: ["#fd8787ff", "#ff0000ff", "#fd8787ff", "#ff0000ff", "#fd8787ff"],
              color: ["#ff0000ff", "#fd8787ff", "#ff0000ff", "#fd8787ff", "#ff0000ff"],
              textColor: "white",
              onTouch: () => {
                playSound('click'),
                  setModalVisible(true)
              },
            },
            {
              key: "changePass",
              text: showChangePassword ? "Cancelar" : "Cambiar contraseña",
              borderColor: ["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"],
              color: ["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"],
              textColor: "white",
              onTouch: () => {
                playSound('click')
                setShowChangePassword(!showChangePassword)
              },
            },
            {
              key: "changeEmail",
              text: showChange2Email ? "Cancelar" : "Cambiar correo registrado",
              borderColor: ["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"],
              color: ["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"],
              textColor: "white",
              onTouch: () => {
                playSound('click'),
                  setShowChange2Email(!showChange2Email)
              },
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
                borderColors={btn.borderColor}
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
