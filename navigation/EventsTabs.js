
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image, StyleSheet } from 'react-native';
import PrivateMeeting from '../screens/PrivateMeeting'
import CatasVip from '../screens/CatasVip';

import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const EventsTabs = () => {
    return (
        <Tab.Navigator

            screenOptions={({ route }) => ({
                tabBarInactiveBackgroundColor: '#000000ff',
                   tabBarActiveTintColor: '#a88e19ff',
                headerShown: false,
                tabBarInactiveTintColor: '#ffffffff',
                tabBarStyle: { borderTopWidth: 0, height: 90 },
                tabBarLabelStyle: { width: '100%', fontSize: 12, marginTop: 4, fontWeight: "300", textTransform: 'uppercase', fontFamily: 'Jost_600SemiBold' },

                tabBarActiveBackgroundColor: '#000000ff',
                tabBarIcon: ({ color, focused, size }) => {
                    let iconName;
                    if (route.name === 'Reunion Privada') {
                        iconName = focused ? 'account-group' : 'account-group-outline';
                    } else if (route.name === 'Catas VIP') {
                        iconName = focused ? 'card-account-details-star' : 'card-account-details-star-outline'
                    }
                    return <MaterialCommunityIcons name={iconName} color={color} size={size} />
                }
            })}

        >


            <Tab.Screen name="Reunion Privada" component={PrivateMeeting} />
            <Tab.Screen name="Catas VIP" component={CatasVip} />

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