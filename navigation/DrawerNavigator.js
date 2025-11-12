import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { View, Image, StyleSheet, TouchableOpacity, Text, Switch } from "react-native";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useThemeContext } from "../context/ThemeContext";
import { useNavigation, useTheme } from "@react-navigation/native";
import AboutUsTabs from "./AboutUsTabs";
import EventsTabs from "./EventsTabs";
import UserStack from "./UserStack";
import AccesoriesPro from "../screens/AccesoriesPro";
import logoMenu from "../assets/images/logo-nuevo.png";
import icon1 from "../assets/icons/menu-1.png";
import icon2 from "../assets/icons/menu-2.png";
import icon3 from "../assets/icons/menu-3.png";
import icon4 from "../assets/icons/menu-4.png";
import icon5 from "../assets/icons/menu-btn2.png";
import LegalStack from "./LegalStack";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import AdminTabs from "./AdminTabs";
import CoffeesStack from "./CoffeesStack";
import CartStack from "./CartStack";
import { playSound } from "../utils/soundPlayer";
import { LinearGradient } from "expo-linear-gradient";


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
      playSound('click')
      await signOut(auth);
      props.navigation.navigate("Área personal", { screen: "Login" }); // 👈 Navegación correcta al stack anidado
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  const handleChangeTema = () => {
    playSound('switch');
    toggleTheme();

  }

  const handleLoginRedirect = () => {
    playSound('click')
    props.navigation.navigate("Área personal", { screen: "Login" });
  };

  return (

    <LinearGradient colors={[colors.card, colors.background, colors.card]} // tus colores del degradado
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
        {/* 🔹 Logo superior */}

        <View style={[styles.logoContainer, { borderBottomColor: colors.border, }]}>
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
                <Text style={[styles.logoutText, { color: colors.text }]}>
                  Iniciar sesión
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 🔹 Switch de modo oscuro */}
          <View style={[styles.switchContainer, { borderTopColor: colors.border, }]}>
            <Text style={[styles.switchLabel, { color: colors.text }]}>
              {isDark ? "Cambiar a Tema Light" : "Cambiar a Tema Dark"}
            </Text>
            <Switch
              value={!!isDark}
              onValueChange={handleChangeTema}
              thumbColor={colors.text}
              trackColor={{ false: "#999", true: "#666" }}

            />
          </View>
        </View>
      </DrawerContentScrollView>
    </LinearGradient>


  );
}

export default function DrawerNavigator() {
  const { colors } = useTheme();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("❌ No hay usuario logueado");
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();


          if (data.isAdmin) {

            setIsAdmin(true);
          } else {

            setIsAdmin(false);
          }
        } else {

          setIsAdmin(false);
        }
      } catch (error) {
        console.error("🔥 Error verificando admin:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);


  return (


    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.background, height: 120 },
        headerTintColor: colors.text,
        drawerStyle: { backgroundColor: colors.background },
        drawerActiveTintColor: colors.text,
        drawerLabelStyle: {
          fontFamily: "Jost_600SemiBold",
          textTransform: "uppercase",
          letterSpacing: 1,
        },
        headerBackground: () => (
          <LinearGradient
            colors={[colors.card, colors.background, colors.card]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1 }}
          />
        ),
        headerTitle: () => (
          <Image
            source={logoMenu}
            style={{
              width: 60,
              resizeMode: "contain",
              shadowColor: "#fdfdfdff",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 2,
            }}
          />
        ),
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => {
              playSound("click"); // 🎵 reproduce el sonido
              navigation.navigate("MainDrawer", { screen: "CartScreen" }); // navega normalmente
            }}
          // 👈 ajusta al nombre de tu pantalla
          >
            <Ionicons name="cart" size={26} color={colors.text} />
          </TouchableOpacity>
        ),

      }}
    >
      <Drawer.Screen
        name="Nuestros Cafés"
        component={CoffeesStack}
        options={{
          drawerIcon: ({ size }) => <Image source={icon1} style={{ width: size, height: size }} />,
        }}
        listeners={{
          drawerItemPress: () => playSound("click"),
        }}
      />
      <Drawer.Screen
        name="¿Quiénes Somos?"
        component={AboutUsTabs}
        options={{
          drawerIcon: ({ size }) => <Image source={icon2} style={{ width: size, height: size }} />,
        }}
        listeners={{
          drawerItemPress: () => playSound("click"),
        }}
      />

      {/* 👇 Solo muestra "Área personal" si hay usuario logueado */}

      <Drawer.Screen
        name="Área personal"
        component={UserStack}
        options={{
          drawerIcon: ({ size }) => <Image source={icon5} style={{ width: size, height: size }} />,
        }}
        listeners={{
          drawerItemPress: () => playSound("click"),
        }}
      />
      <Drawer.Screen
        name="Eventos"
        component={EventsTabs}
        options={{
          drawerIcon: ({ size }) => <Image source={icon3} style={{ width: size, height: size }} />,
        }}
        listeners={{
          drawerItemPress: () => playSound("click"),
        }}
      />
      <Drawer.Screen
        name="Accesorios Pro"
        component={AccesoriesPro}
        options={{
          drawerIcon: ({ size }) => <Image source={icon4} style={{ width: size, height: size }} />,
        }}
        listeners={{
          drawerItemPress: () => playSound("click"),
        }}
      />
      <Drawer.Screen
        name="Legal"
        component={LegalStack}
        options={{
          drawerIcon: ({ size }) => <Image source={icon1} style={{ width: size, height: size }} />,
        }}
        listeners={{
          drawerItemPress: () => playSound("click"),
        }}
      />
      <Drawer.Screen
        name="CartScreen"
        component={CartStack}
        options={{
          drawerItemStyle: { display: 'none' }, // 👈 Esto lo oculta del menú lateral
        }}
        listeners={{
          drawerItemPress: () => playSound("click"),
        }}
      />
      {/* 🔒 Pantalla visible solo si es admin */}
      {isAdmin && (
        <Drawer.Screen
          name="Panel de Administración"
          component={AdminTabs}
          options={{
            drawerIcon: ({ size }) => <MaterialIcons name="admin-panel-settings" size={size} color={colors.text} />,
          }}
          listeners={{
            drawerItemPress: () => playSound("click"),
          }}
        />
      )}

    </Drawer.Navigator>

  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 100,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 2,
    shadowRadius: 4,
    elevation: 2,
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

    paddingTop: 10,
  },
  switchLabel: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 16,
  },
});
