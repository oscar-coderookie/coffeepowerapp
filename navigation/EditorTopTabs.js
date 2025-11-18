import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "@react-navigation/native";
import AdminStackNavigator from "./AdminStackNav";
import AdminUsersStack from "./AdminUsersStack";
      // Ajustes

const TopTab = createMaterialTopTabNavigator();

export default function EditorTopTabs() {
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
        name="Editor Cafés"
        component={AdminStackNavigator}
      />
      <TopTab.Screen
        name="Editor Usuarios"
        component={AdminUsersStack}
      />
    </TopTab.Navigator>
  );
}
