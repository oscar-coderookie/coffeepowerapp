import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function TermsScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Términos y Condiciones</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        Al utilizar la app Coffee Power, aceptas los siguientes términos y condiciones. Te
        recomendamos leerlos cuidadosamente.
      </Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>1. Uso del servicio</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        Esta aplicación está destinada únicamente para el uso personal y no comercial de los
        usuarios. Está prohibido reproducir, distribuir o modificar el contenido sin autorización.
      </Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>2. Propiedad intelectual</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        Todo el contenido, incluyendo logotipos, textos e imágenes, pertenece a Coffee Power o a
        sus respectivos titulares.
      </Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>3. Responsabilidad</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        No nos hacemos responsables por interrupciones temporales del servicio o errores derivados
        del uso indebido de la app.
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
