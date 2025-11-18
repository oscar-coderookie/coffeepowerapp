// PerfilTopTabs.js
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "@react-navigation/native";
import { DiscountsStack } from "./DiscountsStack";
import MassCampaignScreen from "../screens/admin/MassCampaignScreen";
      // Ajustes

const TopTab = createMaterialTopTabNavigator();

export default function CampaignsTopTabs() {
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
        name="Descuentos"
        component={DiscountsStack}
      />
      <TopTab.Screen
        name="Mensajes"
        component={MassCampaignScreen}
      />
    </TopTab.Navigator>
  );
}
