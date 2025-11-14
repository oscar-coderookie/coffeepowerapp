
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AboutUsScreen from '../screens/AboutUsScreen';
import { Image, StyleSheet } from 'react-native';
import ContactScreen from '../screens/ContactScreen';
import { useTheme } from '@react-navigation/native';
import { playSound } from '../utils/soundPlayer';
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();

const AboutUsTabs = () => {
    const { colors } = useTheme();
    return (
        <Tab.Navigator

            screenOptions={({ route }) => ({
                tabBarActiveTintColor: colors.gold,
                headerShown: false,
                tabBarInactiveTintColor: colors.text,
                tabBarStyle: { borderTopWidth: 0, height: 90, backgroundColor: colors.background },
                tabBarLabelStyle: { width: '100%', fontSize: 12, marginTop: 4, fontWeight: "300", textTransform: 'uppercase', fontFamily: 'Jost_600SemiBold' },
                tabBarBackground: () => (
                    <LinearGradient
                        colors={[colors.card, colors.card, colors.gray, colors.card, colors.card]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1 }} />
                ),
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

            <Tab.Screen
                name="Reseña"
                component={AboutUsScreen}
                listeners={{
                    tabPress: () => playSound("click"),
                }}
            />
            <Tab.Screen
                name="Contacto"
                component={ContactScreen}
                listeners={{
                    tabPress: () => playSound("click"),
                }}
            />

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