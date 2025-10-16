import { Text, View } from "react-native";
import ButtonGeneral from "../components/ButtonGeneral";
import ConfirmDeleteModal from "../components/DeleteModal";
import { useState } from "react";
import { useTheme } from "@react-navigation/native";
import ChangePasswordDirect from "../components/ChangePass";

const UserSettings = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { colors } = useTheme();

  return (
    <View>
      <Text style={{ fontFamily: 'Jost_600SemiBold', fontSize: 18, marginBottom: 10 }}>Ajustes de usuario</Text>

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
        <ChangePasswordDirect
          onSuccess={() => {
            setShowChangePassword(false); // ocultar el formulario
          }}
        />
      )}
    </View>
  );
};

export default UserSettings;
