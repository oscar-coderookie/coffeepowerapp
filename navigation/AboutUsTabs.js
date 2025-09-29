
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {  MaterialCommunityIcons } from '@expo/vector-icons';
import AboutUsScreen from '../screens/AboutUsScreen';
import { Image, StyleSheet } from 'react-native';
import ContactScreen from '../screens/ContactScreen';

const Tab = createBottomTabNavigator();

const AboutUsTabs = () => {
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
                    if (route.name === 'Reseña') {
                        iconName = focused ? 'nature-people' : 'nature-people-outline';
                    } else if (route.name === 'Contacto') {
                        iconName = focused ? 'contacts' : 'contacts-outline'
                    }
                    return <MaterialCommunityIcons name={iconName} color={color} size={size} />
                }
            })}

        >

            <Tab.Screen name="Reseña" component={AboutUsScreen}/>
            <Tab.Screen name="Contacto" component={ContactScreen} />

        </Tab.Navigator>
    )
};

export default AboutUsTabs;

const styles = StyleSheet.create({
    sections: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    }
});