
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import CoffeesStack from './CoffeesStack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CartStack from './CartStack';
import { useTheme } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const Tabs = () => {
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
                    if (route.name === 'Catálogo') {
                        iconName = focused ? 'coffee' : 'coffee-outline';
                    } else if (route.name === 'Carrito') {
                        iconName = focused ? 'shopping' : 'shopping-outline'
                    }
                    return <MaterialCommunityIcons name={iconName} color={color} size={size} />
                }
            })}

        >
            <Tab.Screen name="Catálogo" component={CoffeesStack} />
            <Tab.Screen name="Carrito" component={CartStack} />

        </Tab.Navigator>
    )
};

export default Tabs;

const styles = StyleSheet.create({
    
    sections: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    }
});


