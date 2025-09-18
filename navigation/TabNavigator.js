
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import icon1 from '../assets/icons/menu-1.png';
import icon2 from '../assets/icons/menu-2.png';
import icon3 from '../assets/icons/menu-3.png';
import icon4 from '../assets/icons/menu-4.png';
import ContactScreen from '../screens/ContactScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import { Image, StyleSheet, Text, View } from 'react-native';
import OurCoffees from '../screens/OurCoffees';
import AccesoriesPro from '../screens/AccesoriesPro';
import CoffeesStack from './CoffeesStack';


const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator

            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.6)', // 👈 semi-transparente
                    height: 90,
                    borderTopWidth: 0,
                    elevation: 0,
                },
                tabBarActiveTintColor: "#9c9256ff",
                tabBarInactiveTintColor: "#fff",
                tabBarLabelStyle: { width:'100%' ,fontSize: 12, marginTop: 4, fontWeight: "300", textTransform: 'uppercase', fontFamily:'Jost_400Regular' },
                tabBarIconStyle: { marginTop: 6 },
            }}

        >

            <Tab.Screen
                name="Nuestros Cafés"
                component={CoffeesStack}
                options={{
                    tabBarIcon: () => (
                        <Image
                            source={icon1}
                            style={{
                                width: 40,
                                height: 40,

                            }}

                        />
                    )
                }} />
            <Tab.Screen name="¿Quiénes Somos?" component={AboutUsScreen} options={{
                tabBarIcon: () => (
                    <Image
                        source={icon4}
                        style={{
                            width: 40,
                            height: 40,
                        }}
                    />
                )
            }} />
            <Tab.Screen name="Accesorios Pro" component={AccesoriesPro} options={{
                tabBarIcon: () => (
                    <Image
                        source={icon2}
                        style={{
                            width: 40,
                            height: 40,

                        }}

                    />
                )
            }} />
            <Tab.Screen name="Contacto" component={ContactScreen} options={{
                tabBarIcon: () => (
                    <Image
                        source={icon3}
                        style={{
                            width: 40,
                            height: 40,

                        }}

                    />
                )
            }} />
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


