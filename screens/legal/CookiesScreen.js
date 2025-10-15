import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function CookiesScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Política de Cookies</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        Esta aplicación utiliza cookies y tecnologías similares para mejorar la experiencia del usuario,
        analizar el tráfico y personalizar el contenido mostrado.
      </Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>¿Qué son las cookies?</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        Las cookies son pequeños archivos de texto almacenados en tu dispositivo cuando visitas un sitio
        web o usas una aplicación. No dañan tu dispositivo y pueden ser eliminadas en cualquier momento.
      </Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>Tipos de cookies utilizadas</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        • Cookies necesarias: esenciales para el funcionamiento básico de la app.{"\n"}
        • Cookies analíticas: permiten medir la interacción y mejorar el servicio.{"\n"}
        • Cookies de personalización: guardan tus preferencias de idioma o tema.
      </Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>Gestión de cookies</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        Puedes configurar tu dispositivo o navegador para bloquear o eliminar cookies, aunque algunas
        funciones podrían verse afectadas.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontFamily: "Jost_600SemiBold", marginBottom: 12 },
  subtitle: { fontSize: 18, fontFamily: "Jost_500Medium", marginTop: 16, marginBottom: 6 },
  text: {
    fontSize: 15,
    fontFamily: "Jost_400Regular",
    lineHeight: 22,
    textAlign: "justify",
  },
});
