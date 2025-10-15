import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function PrivacyScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Política de Privacidad</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        Esta Política de Privacidad describe cómo se recopilan, utilizan y protegen tus datos personales
        cuando usas esta aplicación o realizas compras en nuestra tienda de café online, de acuerdo con
        el Reglamento General de Protección de Datos (RGPD).
      </Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>Responsable del tratamiento</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        El responsable del tratamiento de los datos personales es (representante legal).
      </Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>Finalidad de los datos</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        Los datos se recogen con el fin de gestionar pedidos, mejorar la experiencia del usuario, enviar
        comunicaciones relacionadas con los productos y ofrecer atención al cliente personalizada.
      </Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>Conservación de los datos</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        Los datos se conservarán durante el tiempo necesario para cumplir con las obligaciones legales o
        mientras exista una relación comercial activa con el usuario.
      </Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>Derechos del usuario</Text>
      <Text style={[styles.text, { color: colors.text }]}>
        Puedes ejercer tus derechos de acceso, rectificación, supresión y portabilidad de datos según lo
        establecido en el RGPD.
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
