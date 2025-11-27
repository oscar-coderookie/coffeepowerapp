import { View, Text } from 'react-native'
import React from 'react'
import { MotiView } from 'moti'
import ChangePasswordDirect from '../../../components/ChangePass'
import CustomHeader from '../../../components/CustomHeader'

const ChangePassScreen = () => {
    return (

        <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 400 }}
        >
            <CustomHeader title="cambiar contraseña" showBack />
            <View style={{margin:10}}>
                <ChangePasswordDirect />
            </View>
        </MotiView>


    )
}

export default ChangePassScreen