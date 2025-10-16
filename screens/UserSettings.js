import { Text, View } from "react-native"
import ButtonGeneral from "../components/ButtonGeneral";
import ConfirmDeleteModal from "../components/DeleteModal";
import { useState } from "react";

const UserSettings = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={{}}>
            <Text>Ajustes de usuario</Text>
            <ButtonGeneral text="Eliminar cuenta" onTouch={() => setModalVisible(true)} bckColor='red' marginHorizontal={10} textColor='white' />
             <ConfirmDeleteModal isVisible={modalVisible} onClose={() => setModalVisible(false)} />
        </View>
    )
};

export default UserSettings;