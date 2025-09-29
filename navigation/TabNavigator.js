
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import CoffeesStack from './CoffeesStack';
import {  MaterialCommunityIcons } from '@expo/vector-icons';
import CartStack from './CartStack';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator


            screenOptions={({ route }) => ({
                tabBarInactiveBackgroundColor: '#000000ff',
                   tabBarActiveTintColor: '#a88e19ff',
                headerShown: false,
                tabBarInactiveTintColor: '#ffffffff',
                tabBarStyle:{borderTopWidth: 0, height: 90, backgroundColor: '#000000ff'},
                               tabBarLabelStyle: { width: '100%', fontSize: 12, marginTop: 4, fontWeight: "300", textTransform: 'uppercase', fontFamily: 'Jost_600SemiBold' },

                tabBarActiveBackgroundColor:'#000000ff',
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


