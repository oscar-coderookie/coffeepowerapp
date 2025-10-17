// navigators/DrawerNavigator.js
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { View, Image, StyleSheet, TouchableOpacity, Text, Switch } from "react-native";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "../context/ThemeContext";
import { useTheme } from "@react-navigation/native";

import Tabs from "./TabNavigator";
import AboutUsTabs from "./AboutUsTabs";
import EventsTabs from "./EventsTabs";
import CartStack from "./CartStack";
import UserStack from "./UserStack";
import AccesoriesPro from "../screens/AccesoriesPro";

import logo from "../assets/images/logo.png";
import logoMenu from "../assets/images/logo-nuevo.png";
import icon1 from "../assets/icons/menu-1.png";
import icon2 from "../assets/icons/menu-2.png";
import icon3 from "../assets/icons/menu-3.png";
import icon4 from "../assets/icons/menu-4.png";
import icon5 from "../assets/icons/menu-btn2.png";
import LegalStack from "./LegalStack";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { isDark, toggleTheme } = useThemeContext();
  const [user, setUser] = useState(null);
  const { colors } = useTheme()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      props.navigation.navigate("Área personal", { screen: "Login" }); // 👈 Navegación correcta al stack anidado
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleLoginRedirect = () => {
    props.navigation.navigate("Área personal", { screen: "Login" });
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* 🔹 Logo superior */}
      <View style={styles.logoContainer}>
        <Image source={logoMenu} style={styles.logo} resizeMode="contain" />
      </View>

      {/* 🔹 Items del menú */}
      <DrawerItemList {...props} />

      {/* 🔹 Footer dinámico */}
      <View style={styles.footerContainer}>
        <View style={styles.authContainer}>
          {user ? (
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="exit-outline" size={24} color={colors.text} />
              <Text style={[styles.logoutText, { color: colors.text }]}>
                Cerrar sesión
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLoginRedirect}>
              <Ionicons name="log-in-outline" size={24} color={colors.text} />
              <Text style={[styles.logoutText, { color:colors.text }]}>
                Iniciar sesión
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 🔹 Switch de modo oscuro */}
        <View style={styles.switchContainer}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>
            {isDark ? "Cambiar a Tema Light" : "Cambiar a Tema Dark"}
          </Text>
          <Switch
            value={!!isDark}
            onValueChange={toggleTheme}
            thumbColor={colors.text}
            trackColor={{ false: "#999", true: "#666" }}
          />
        </View>
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
        drawerStyle: { backgroundColor: colors.background },
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
          drawerIcon: ({ size }) => <Image source={icon1} style={{ width: size, height: size }} />,
        }}
      />
      <Drawer.Screen
        name="¿Quiénes Somos?"
        component={AboutUsTabs}
        options={{
          drawerIcon: ({ size }) => <Image source={icon2} style={{ width: size, height: size }} />,
        }}
      />
 
      {/* 👇 Solo muestra "Área personal" si hay usuario logueado */}

      <Drawer.Screen
        name="Área personal"
        component={UserStack}
        options={{
          drawerIcon: ({ size }) => <Image source={icon5} style={{ width: size, height: size }} />,
        }}
      />
           <Drawer.Screen
        name="Eventos"
        component={EventsTabs}
        options={{
          drawerIcon: ({ size }) => <Image source={icon3} style={{ width: size, height: size }} />,
        }}
      />
      <Drawer.Screen
        name="Accesorios Pro"
        component={AccesoriesPro}
        options={{
          drawerIcon: ({ size }) => <Image source={icon4} style={{ width: size, height: size }} />,
        }}
      />
      <Drawer.Screen
        name="Legal"
        component={LegalStack}
        options={{
          drawerIcon: ({ size }) => <Image source={icon1} style={{ width: size, height: size }} />,
        }}
      />

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
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 3,
    shadowRadius: 4,
    elevation: 10,
  },
  footerContainer: {
    marginTop: "auto",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  authContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 15,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 15,
    marginLeft: 8,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 10,
  },
  switchLabel: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 16,
  },
});
