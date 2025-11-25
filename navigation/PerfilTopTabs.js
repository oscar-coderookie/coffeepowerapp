// PerfilTopTabs.js
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "@react-navigation/native";
import UserAreaScreen from "../screens/user/UserAreaScreen";
import UserSettingsStack from "./UserSettingsStack";
      // Ajustes

const TopTab = createMaterialTopTabNavigator();

export default function PerfilTopTabs() {
  const { colors } = useTheme();

  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.background,
          height: 50,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Jost_600SemiBold",
          textTransform: "uppercase",
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.gold,
          height: 3,
          borderRadius: 2,
        },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.text,
      }}
    >
      <TopTab.Screen
        name="Información"
        component={UserAreaScreen}
      />
      <TopTab.Screen
        name="Ajustes"
        component={UserSettingsStack}
      />
    </TopTab.Navigator>
  );
}
