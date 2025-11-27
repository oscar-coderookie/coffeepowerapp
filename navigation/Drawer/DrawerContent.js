import { useEffect, useState } from "react";
import { useThemeContext } from "../../context/ThemeContext";
import { useTheme } from "@react-navigation/native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { playSound } from "../../utils/soundPlayer";
import { LinearGradient } from "expo-linear-gradient";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import logoMenu from "../../assets/images/webp/logo-nuevo.webp";
import { Switch } from "react-native";


export function CustomDrawerContent(props) {
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

    <LinearGradient colors={[colors.card, colors.card, colors.gray, colors.card, colors.card]} // tus colores del degradado
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

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 1,
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
