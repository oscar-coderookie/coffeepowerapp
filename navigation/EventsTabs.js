
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import icon1 from '../assets/icons/menu-1.png';
import icon2 from '../assets/icons/menu-2.png';
import { Image, StyleSheet} from 'react-native';
import PrivateMeeting from '../screens/PrivateMeeting'
import CatasVip from '../screens/CatasVip';

const Tab = createBottomTabNavigator();

const EventsTabs = () => {
    return (
        <Tab.Navigator

            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: 'rgba(5, 5, 5, 1)', // 👈 semi-transparente
                    height: 80,
                    borderTopWidth: 0,
                    elevation: 0,
                },
                tabBarActiveTintColor: "#9c9256ff",
                tabBarInactiveTintColor: "#fff",
                tabBarLabelStyle: { width: '100%', fontSize: 12, marginTop: 4, fontWeight: "300", textTransform: 'uppercase', fontFamily: 'Jost_400Regular' },
                tabBarIconStyle: { marginTop: 6 },
                headerStyle: { backgroundColor: "#111111ff" },
                headerTintColor: "#fff", // color de la flecha y texto
                headerTitleStyle: { fontFamily: "Jost_600SemiBold" }
            }}

        >
            
    
            <Tab.Screen
                name="Reunion Privada"
                component={PrivateMeeting}
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
            <Tab.Screen name="Catas VIP" component={CatasVip} options={{
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
     
        </Tab.Navigator>
    )
};

export default EventsTabs;

const styles = StyleSheet.create({
    sections: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    }
});