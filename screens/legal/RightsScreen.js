import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function RightsScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Tus derechos según el RGPD</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        De acuerdo con el Reglamento General de Protección de Datos (RGPD), tienes los siguientes
        derechos sobre tus datos personales:
      </Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>1. Derecho de acceso</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        Puedes solicitar información sobre los datos personales que tenemos almacenados.
      </Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>2. Derecho de rectificación</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        Tienes derecho a solicitar la corrección de datos inexactos o incompletos.
      </Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>3. Derecho de supresión</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        Puedes pedir que eliminemos tus datos personales cuando ya no sean necesarios para los fines
        originales.
      </Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>4. Derecho a la portabilidad</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        Puedes solicitar una copia de tus datos en un formato estructurado y de uso común.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: "Jost_600SemiBold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Jost_500Medium",
    marginTop: 16,
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    fontFamily: "Jost_400Regular",
    lineHeight: 22,
    textAlign:'justify'
  },
});
