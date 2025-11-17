
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from "@react-navigation/native";
import UserAreaScreen from '../screens/user/UserAreaScreen';
import FavoritesScreen from '../screens/user/FavouritesScreen';
import UserSettings from '../screens/user/UserSettings';
import CouponsClientScreen from '../screens/user/CouponsClientScreen';
import { playSound } from '../utils/soundPlayer';
import PerfilTopTabs from './PerfilTopTabs';
import UserMessagesScreen from '../screens/user/UserMessagesScreen';
import MessagesStack from './MessagesStack';

const Tab = createBottomTabNavigator();

const UserTabs = () => {
    const { colors } = useTheme();
    return (
        <Tab.Navigator


            screenOptions={({ route }) => ({
                tabBarInactiveBackgroundColor: colors.background,
                tabBarActiveTintColor: colors.gold,
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
                    } else if (route.name === "Cupones") {
                        iconName = focused ? 'pricetag' : 'pricetag-outline'
                    } else if (route.name === "Mensajes") {
                        iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'
                    }
                    return <Ionicons name={iconName} color={color} size={size} />
                }
            })}

        >
            <Tab.Screen
                name="Perfil"
                component={PerfilTopTabs}
                listeners={{
                    tabPress: () => playSound("click"),
                }} />
            <Tab.Screen
                name="Favoritos"
                component={FavoritesScreen}
                listeners={{
                    tabPress: () => playSound("click"),
                }} />
            <Tab.Screen
                name="Cupones"
                component={CouponsClientScreen}
                listeners={{
                    tabPress: () => playSound("click"),
                }} />
            <Tab.Screen
                name="Mensajes"
                component={MessagesStack}
                listeners={{
                    tabPress: () => playSound("click"),
                }} />

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


