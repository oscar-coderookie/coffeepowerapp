
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from "@react-navigation/native";
import { useUnreadMessages } from '../hooks/useUnreadMessages';
import FavoritesScreen from '../screens/user/FavouritesScreen';
import UserSettings from '../screens/user/UserSettings';
import CouponsClientScreen from '../screens/user/CouponsClientScreen';
import { playSound } from '../utils/soundPlayer';
import PerfilTopTabs from './PerfilTopTabs';
import MessagesStack from './MessagesStack';

const Tab = createBottomTabNavigator();

const UserTabs = () => {
    const { colors } = useTheme();
    const unreadCount = useUnreadMessages();
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
                        iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';

                        return (
                            <View style={{ width: 28, height: 28 }}>
                                <Ionicons name={iconName} color={color} size={size} />
                                {unreadCount > 0 && (
                                    <View
                                        style={{
                                            position: 'absolute',
                                            right: -6,
                                            top: -4,
                                            backgroundColor: 'red',
                                            borderRadius: 10,
                                            minWidth: 18,
                                            height: 18,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingHorizontal: 3,
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
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


