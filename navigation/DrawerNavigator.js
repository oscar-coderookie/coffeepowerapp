// navigators/DrawerNavigator.js
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import Tabs from "./TabNavigator";
import AboutUsTabs from "./AboutUsTabs";
import EventsTabs from "./EventsTabs";
import logo from "../assets/images/logo.png";
import logoMenu from '../assets/images/logo-nuevo.png'

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* 🔹 Logo arriba */}
      <View style={styles.logoContainer}>
        <Image source={logoMenu} style={styles.logo} resizeMode="contain" />
      </View>

      {/* 🔹 Items del drawer */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#000000ff" },
        headerTintColor: "#fff",
        drawerStyle: { backgroundColor: "#000000ff" }, // fondo del menú
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#aaa",
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
      <Drawer.Screen name="Nuestros Productos" component={Tabs} />
      <Drawer.Screen name="¿Quiénes Somos?" component={AboutUsTabs} />
      <Drawer.Screen name="Eventos" component={EventsTabs} />
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
  logoMenu:{
    width: 150,
    height: 50
  }
});
