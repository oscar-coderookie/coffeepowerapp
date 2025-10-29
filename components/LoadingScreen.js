import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { MotiView } from "moti";
import { useTheme } from "@react-navigation/native";
import logo from "../assets/icon.png";

export default function LoadingScreen({ message = "Cargando..." }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: "black"}]}>
      {/* 💥 Logo con efecto de pulso */}
      <MotiView
        from={{ scale: 1 }}
        animate={{ scale: 1.15 }}
        transition={{
          type: "timing",
          duration: 900,
          repeat: Infinity,
          repeatReverse: true,
        }}
        style={styles.iconWrapper}
      >
        <Image
          source={logo}
          style={[styles.image, { width: 160, height: 160 }]}
          resizeMode="contain"
        />
      </MotiView>

      {/* Texto de carga */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 800, delay: 400 }}
      >
        <Text style={[styles.text]}>{message}</Text>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 6,
    fontSize: 20,
    color:'white',
    fontFamily: "Jost_600SemiBold",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  image:{
     shadowColor: "#ffffffff", // color del resplandor
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
  }
});
