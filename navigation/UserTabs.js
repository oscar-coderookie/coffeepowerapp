
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import CoffeesStack from './CoffeesStack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CartStack from './CartStack';
import { useTheme } from "@react-navigation/native";
import UserAreaScreen from '../screens/UserAreaScreen';
import FavoritesScreen from '../screens/FavouritesScreen';
import PaymentMethods from '../screens/PaymentMethods';
import UserSettings from '../screens/UserSettings';

const Tab = createBottomTabNavigator();

const UserTabs = () => {
    const { colors } = useTheme();
    return (
        <Tab.Navigator


            screenOptions={({ route }) => ({
                tabBarInactiveBackgroundColor: colors.background,
                tabBarActiveTintColor: '#a88e19ff',
                headerShown: false,
                tabBarInactiveTintColor: colors.text,
                tabBarStyle: { borderTopWidth: 0, height: 90, backgroundColor: colors.background },
                tabBarLabelStyle: { width: '100%', fontSize: 12, marginTop: 4, fontWeight: "300", textTransform: 'uppercase', fontFamily: 'Jost_600SemiBold' },
                tabBarActiveBackgroundColor: colors.background,
                tabBarIcon: ({ color, focused, size }) => {
                    let iconName;
                    if (route.name === 'Perfil') {
                        iconName = focused ? 'person-circle-sharp' : 'person-circle-outline';
                    } else if (route.name === 'Favoritos') {
                        iconName = focused ? 'star' : 'star-outline'
                    } else if (route.name === "Pagos") {
                         iconName = focused ? 'card' : 'card-outline'
                    }  else if (route.name === "Ajustes") {
                         iconName = focused ? 'settings' : 'settings-outline'
                    }
                    return <Ionicons name={iconName} color={color} size={size} />
                }
            })}

        >
            <Tab.Screen name="Perfil" component={UserAreaScreen} />
            <Tab.Screen name="Favoritos" component={FavoritesScreen} />
            <Tab.Screen name="Pagos" component={PaymentMethods} />
            <Tab.Screen name="Ajustes" component={UserSettings} />

        </Tab.Navigator>
    )
};

export default UserTabs;

const styles = StyleSheet.create({

    sections: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    }
});


