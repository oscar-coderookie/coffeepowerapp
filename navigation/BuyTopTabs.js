import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "@react-navigation/native";
import CouponsClientScreen from "../screens/user/CouponsClientScreen";
import UserOrdersScreen from "../screens/user/UserOrdersScreen";
import UserOrdersStack from "./UserOrdersStack";

const TopTab = createMaterialTopTabNavigator();

export default function BuyTopTabs() {
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
        name="Historial de pedidos"
        component={UserOrdersStack}
      />
      <TopTab.Screen
        name="Cupones"
        component={CouponsClientScreen}
      />
    </TopTab.Navigator>
  );
}
