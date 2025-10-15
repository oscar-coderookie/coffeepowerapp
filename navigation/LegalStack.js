import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import PrivacyScreen from "../screens/legal/PrivacyScreen";
import TermsScreen from "../screens/legal/TermsScreen";
import CookiesScreen from "../screens/legal/CookiesScreen";
import RightsScreen from "../screens/legal/RightsScreen";
import { useTheme } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const LegalStack = () => {
  const {colors} = useTheme()
  return (
    <Tab.Navigator
      initialRouteName="Privacidad"
      screenOptions={({ route }) => ({
        tabBarInactiveBackgroundColor: colors.background,
        tabBarActiveTintColor: '#a88e19ff',
        headerShown: false,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: { borderTopWidth: 0, height: 90, backgroundColor: colors.background },
        tabBarLabelStyle: { width: '100%', fontSize: 12, marginTop: 4, fontWeight: "300", textTransform: 'uppercase', fontFamily: 'Jost_600SemiBold' },
        tabBarActiveBackgroundColor: colors.background,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Privacidad") iconName = "lock-closed-outline";
          else if (route.name === "Términos") iconName = "document-text-outline";
          else if (route.name === "Cookies") iconName = "cafe-outline";
          else if (route.name === "Derechos RGPD") iconName = "person-circle-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Privacidad" component={PrivacyScreen} />
      <Tab.Screen name="Términos" component={TermsScreen} />
      <Tab.Screen name="Cookies" component={CookiesScreen} />
      <Tab.Screen name="Derechos RGPD" component={RightsScreen} />
    </Tab.Navigator>
  );
};

export default LegalStack;
