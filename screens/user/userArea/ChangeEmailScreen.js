import { View, Text, TextInput } from 'react-native'
import React, { useContext, useState } from 'react'
import { MotiView } from 'moti';
import ChangePasswordDirect from '../../../components/ChangePass';
import ButtonGeneral from '../../../components/ButtonGeneral';
import PassInput from '../../../components/PassInput';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../../context/AuthContext';
import { useTheme } from '@react-navigation/native';
import CustomHeader from '../../../components/CustomHeader';

const ChangeEmailScreen = () => {s
    const [newEmail, setNewEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const { changeEmail } = useContext(AuthContext);
    const { colors } = useTheme();

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
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400 }}

        >
            <CustomHeader title="cambiar correo registrado" showBack/>
            <View style={{ marginHorizontal: 10, marginTop: 20 }}>
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
            </View>
        </MotiView>
    )
}

export default ChangeEmailScreen