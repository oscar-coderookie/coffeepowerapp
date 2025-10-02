// navigators/DrawerNavigator.js
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import Tabs from "./TabNavigator";
import AboutUsTabs from "./AboutUsTabs";
import EventsTabs from "./EventsTabs";
import logo from "../assets/images/logo.png";
import logoMenu from '../assets/images/logo-nuevo.png';
import AccesoriesPro from "../screens/AccesoriesPro";
import { useThemeContext } from "../context/ThemeContext";
import { useTheme } from "@react-navigation/native";

//icons:
import icon1 from '../assets/icons/menu-1.png';
import icon2 from '../assets/icons/menu-2.png';
import icon3 from '../assets/icons/menu-3.png';
import icon4 from '../assets/icons/menu-4.png';
import icon5 from '../assets/icons/menu-btn2.png';
import { Switch } from "react-native";
import CartStack from "./CartStack";
import UserStack from "./UserStack";

const Drawer = createDrawerNavigator();


function CustomDrawerContent(props) {
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* 🔹 Logo arriba */}
      <View style={styles.logoContainer}>
        <Image source={logoMenu} style={styles.logo} resizeMode="contain" />
      </View>
      {/* 🔹 Items del drawer */}
      <DrawerItemList {...props} />
      {/* 🔹 Switch para Dark Mode */}
      <View style={styles.switchContainer}>
        <Text style={[styles.switchLabel, { color: isDark ? "#fff" : "#000" }]}>
          {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </Text>
        <Switch
          value={!!isDark}
          onValueChange={toggleTheme}
          thumbColor={isDark ? "#fff" : "#000"}
          trackColor={{ false: "#999", true: "#666" }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        drawerStyle: { backgroundColor: colors.background }, // fondo del menú
        drawerActiveTintColor: colors.text,
        drawerInactiveTintColor: colors.text,
        drawerLabelStyle: {
          fontFamily: "Jost_600SemiBold",
          textTransform: "uppercase",
          letterSpacing: 1,
        },
        headerTitle: "",
        headerRight: () => (
          <TouchableOpacity>
            <Image
              source={logo}
              style={{ width: 102.5, height: 37.5, marginRight: 8 }}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="Nuestros Cafés"
        component={Tabs}
        options={{
          drawerIcon: ({ size }) => (
            <Image source={icon1} style={{ width: size, height: size }} />
          ),
        }} />
      <Drawer.Screen
        name="¿Quiénes Somos?"
        component={AboutUsTabs}
        options={{
          drawerIcon: ({ size }) => (
            <Image source={icon2} style={{ width: size, height: size }} />
          ),
        }} />
      <Drawer.Screen
        name="Eventos"
        component={EventsTabs}
        options={{
          drawerIcon: ({ size }) => (
            <Image source={icon3} style={{ width: size, height: size }} />
          ),
        }} />
      <Drawer.Screen
        name="Accesorios Pro"
        component={AccesoriesPro}
        options={{
          drawerIcon: ({ size }) => (
            <Image source={icon4} style={{ width: size, height: size }} />
          ),
        }} />
      <Drawer.Screen
        name="Area personal"
        component={UserStack}
        options={{
          drawerIcon: ({ size }) => (
            <Image source={icon5} style={{ width: size, height: size }} />
          ),
        }} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 100,
    shadowColor: "#fff",         // 👈 color de la sombra (blanca para resplandor)
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 3,
    shadowRadius: 4,             // difuminado
    elevation: 10,
  },
  logoMenu: {
    width: 150,
    height: 50
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
    marginTop: "auto", // 👈 esto lo manda al fondo del drawer
  },
  switchLabel: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 16,
  },
});
