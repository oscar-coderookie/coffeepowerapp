
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {  MaterialCommunityIcons } from '@expo/vector-icons';
import AboutUsScreen from '../screens/AboutUsScreen';
import { Image, StyleSheet } from 'react-native';
import ContactScreen from '../screens/ContactScreen';
import { useTheme } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const AboutUsTabs = () => {
    const { colors } = useTheme();
    return (
        <Tab.Navigator

        screenOptions={({ route }) => ({
                tabBarInactiveBackgroundColor: colors.background,
                tabBarActiveTintColor: '#a88e19ff',
                headerShown: false,
                tabBarInactiveTintColor:colors.text,
                tabBarStyle:{borderTopWidth: 0, height: 90, backgroundColor: colors.background},
                               tabBarLabelStyle: { width: '100%', fontSize: 12, marginTop: 4, fontWeight: "300", textTransform: 'uppercase', fontFamily: 'Jost_600SemiBold' },

                tabBarActiveBackgroundColor:colors.background,
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