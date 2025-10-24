import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import AdminScreen from "../screens/admin/AdminScreen";
import InjectCouponsScreen from "../screens/admin/CouponsScreen";
import AdminCatalogScreen from "../screens/admin/AdminCatalogScreen";
import AdminStackNavigator from "./AdminStackNav";

const Tab = createBottomTabNavigator();

const AdminStack = () => {
  const {colors} = useTheme()
  return (
    <Tab.Navigator
      initialRouteName="Principal"
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
          if (route.name === "Principal") iconName = "admin-panel-settings";
          else if (route.name === "Cupones") iconName = "discount";
          else if (route.name === "Catalogo") iconName = 'playlist-add-circle'
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Principal" component={AdminScreen} />
      <Tab.Screen name="Cupones" component={InjectCouponsScreen} />
      <Tab.Screen name="Catalogo" component={AdminStackNavigator} />

    </Tab.Navigator>
  );
};

export default AdminStack;
