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

const UserSettings = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState("");
  const { user, handleDeleteAccount } = useContext(AuthContext);

  // 🔹 Escuchar cambios en Firestore
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) setNotificationEmail(docSnap.data().email);
    });
    return () => unsubscribe();
  }, [user]);



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
                navigation.navigate("ChangePass");
              },
            },
            {
              key: "changeEmail",
              text: "Cambiar correo registrado",
              borderColor: ["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"],
              color: ["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"],
              textColor: "white",
              onTouch: () => {
                playSound('click'),
                  navigation.navigate('ChangeEmail')
              },


            },
            {
              key: "editAddresses",
              text: "Editar direcciones",
              borderColor: ["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"],
              color: ["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"],
              textColor: "white",
              onTouch: () => {
                playSound("click");
                navigation.navigate("EditAddressScreen");
              },
            },
            {
              key: "NewAdress",
              text: "Crear Nueva Direccion",
              borderColor: ["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"],
              color: ["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"],
              textColor: "white",
              onTouch: () => {
                playSound("click");
                navigation.navigate("NewAdress");
              },
            },
               {
              key: "MetodosPago",
              text: "métodos de pago",
              borderColor: ["#535353ff", "#000000ff", "#535353ff", "#000000ff", "#535353ff"],
              color: ["#000000ff", "#535353ff", "#000000ff", "#6b6b6bff", "#000000ff"],
              textColor: "white",
              onTouch: () => {
                playSound("click");
                navigation.navigate("MetodosPago");
              },
            }
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
