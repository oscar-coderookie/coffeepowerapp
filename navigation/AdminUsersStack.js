import { View, Text } from 'react-native'
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UsersAdminScreen from '../screens/admin/UserAdminScreen';
import EditUserScreen from '../screens/admin/EditUserScreen';

const Stack = createStackNavigator();

export default function AdminUsersStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false, // puedes ponerlo en true si quieres el header automático
            }}>
            <Stack.Screen name='Listar Usuarios' component={UsersAdminScreen} />
            <Stack.Screen name='Editar Usuario' component={EditUserScreen} />
        </Stack.Navigator>
    )
};