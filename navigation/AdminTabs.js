import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { playSound } from "../utils/soundPlayer";
import { LinearGradient } from "expo-linear-gradient";
import CampaignsTopTabs from "./CampaignsTopTabs";
import EditorTopTabs from "./EditorTopTabs";

const Tab = createBottomTabNavigator();

const AdminTabs = () => {
  const { colors } = useTheme()
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarBackground: () => (
          <LinearGradient
            colors={[colors.card, colors.card, colors.gray, colors.card, colors.card]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }} />
        ),
        tabBarActiveTintColor: colors.gold,
        headerShown: false,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: { borderTopWidth: 0, height: 90, backgroundColor: colors.background },
        tabBarLabelStyle: { width: '100%', fontSize: 12, marginTop: 4, fontWeight: "300", textTransform: 'uppercase', fontFamily: 'Jost_600SemiBold' },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Editor") iconName = 'playlist-add-circle'
          else if (route.name === "Campañas") iconName = 'supervised-user-circle'
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >

      <Tab.Screen
        name="Campañas"
        component={CampaignsTopTabs}
        listeners={{
          tabPress: () => playSound("click"),
        }} />
      <Tab.Screen
        name="Editor"
        component={EditorTopTabs}
        listeners={{
          tabPress: () => playSound("click"),
        }} />

    </Tab.Navigator>
  );
};

export default AdminTabs;
