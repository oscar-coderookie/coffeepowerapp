import React from "react";
import { View, Text, StyleSheet, Image, ImageBackground, ActivityIndicator } from "react-native";
import { MotiView } from "moti";
import { useTheme } from "@react-navigation/native";
import logo from "../assets/images/webp/logo-nuevo.webp";
import background from "../assets/images/webp/splash.webp";

export default function LoadingScreen({ message = "Cargando..." }) {
  const { colors } = useTheme();

  return (
    <ImageBackground source={background} resizeMode="cover" style={styles.container}>


      {/* Logo fijo */}
      <View style={styles.iconWrapper}>
        <Image
          source={logo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Spinner bonito */}
      <View style={{ marginTop: 25, flexDirection:'row', alignItems:'center' }}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{fontFamily:'Jost_600SemiBold', color: 'white', fontSize: 20, marginLeft:10}}>Cargando...</Text>
      </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  /* Resplandor animado */
  glowWrapper: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: "rgba(255,255,255,0.4)",
    shadowColor: "white",
    shadowRadius: 40,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
  },

  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 160,
    height: 160,
  },
});
