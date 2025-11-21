import { createDrawerNavigator } from "@react-navigation/drawer";
import { Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import AboutUsTabs from "./AboutUsTabs";
import EventsTabs from "./EventsTabs";
import UserStack from "./UserStack";
import AccesoriesPro from "../screens/AccesoriesPro";
import LegalStack from "./LegalStack";
import AdminTabs from "./AdminTabs";
import CoffeesStack from "./CoffeesStack";
import CartStack from "./CartStack";
import { playSound } from "../utils/soundPlayer";
import { CustomDrawerContent } from "./Drawer/DrawerContent";
import { useAdminStatus } from "../hooks/useAdminStatus";
import HeaderDrawer from "./Drawer/HeaderDrawer";
import { screensConfig } from "./Drawer/ScreensConfig";

const Drawer = createDrawerNavigator();

const componentsMap = {
  CoffeesStack,
  AboutUsTabs,
  EventsTabs,
  UserStack,
  AccesoriesPro,
  LegalStack,
  CartStack,
  AdminTabs,
};

export default function DrawerNavigator() {
  const headerConfig = HeaderDrawer();
  const { colors } = useTheme();
  const { isAdmin, loadingAdmin } = useAdminStatus();
  const pressSound = {
    drawerItemPress: () => playSound("click")
  };

  if (loadingAdmin) return null;

  return (

    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        ...headerConfig,
        headerTitleAlign:'center',
        headerStyle: { height: 120, elevation: 2 },
        drawerStyle: { backgroundColor: colors.background },
        drawerActiveTintColor: colors.text,
        headerTintColor: colors.text,
        drawerLabelStyle: { fontFamily: "Jost_600SemiBold", textTransform: "uppercase", letterSpacing: 1 },
      }}
    >
      {screensConfig.map((screen, index) => {
        const ScreenComponent = componentsMap[screen.component];

        return (
          <Drawer.Screen
            key={index}
            name={screen.name}
            component={ScreenComponent}
            options={{
              drawerItemStyle: screen.hidden ? { display: "none" } : undefined,
              drawerIcon: screen.icon
                ? ({ size }) => (<Image source={screen.icon} style={{ width: size, height: size }} />) : undefined
            }}
            listeners={pressSound}
          />
        );
      })}
      {isAdmin && (
        <Drawer.Screen
          name="Panel de Administración"
          component={AdminTabs}
          options={{
            drawerIcon: ({ size }) => <MaterialIcons name="admin-panel-settings" size={size} color={colors.text} />,
          }}
          listeners={pressSound} />
      )}

    </Drawer.Navigator>

  );
}

