import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import AdminScreen from "../screens/admin/AdminScreen";
import AdminStackNavigator from "./AdminStackNav";
import { DiscountsStack } from "./DiscountsStack";
import AdminUsersStack from "./AdminUsersStack";

const Tab = createBottomTabNavigator();

const AdminTabs = () => {
  const {colors} = useTheme()
  return (
    <Tab.Navigator
      initialRouteName="Principal"
      screenOptions={({ route }) => ({
        tabBarInactiveBackgroundColor: colors.background,
        tabBarActiveTintColor: colors.gold,
        headerShown: false,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: { borderTopWidth: 0, height: 90, backgroundColor: colors.background },
        tabBarLabelStyle: { width: '100%', fontSize: 12, marginTop: 4, fontWeight: "300", textTransform: 'uppercase', fontFamily: 'Jost_600SemiBold' },
        tabBarActiveBackgroundColor: colors.background,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Principal") iconName = "admin-panel-settings";
          else if (route.name === "Descuentos") iconName = "discount";
          else if (route.name === "Editor") iconName = 'playlist-add-circle'
           else if (route.name === "Usuarios") iconName = 'supervised-user-circle'
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Principal" component={AdminScreen} />
      <Tab.Screen name="Descuentos" component={DiscountsStack} />
      <Tab.Screen name="Editor" component={AdminStackNavigator} />
      <Tab.Screen name="Usuarios" component={AdminUsersStack} />

    </Tab.Navigator>
  );
};

export default AdminTabs;
