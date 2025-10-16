export function UnverifiedScreen({ navigation }) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontFamily: "Jost_600SemiBold", fontSize: 20, textAlign: "center", marginBottom: 20 }}>
        ⚠️ Activa tu cuenta
      </Text>
      <Text style={{ fontFamily: "Jost_400Regular", fontSize: 16, textAlign: "center", marginBottom: 30 }}>
        Debes verificar tu correo antes de acceder al área de cliente. Revisa tu bandeja de entrada.
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: colors.text,
          padding: 15,
          borderRadius: 8,
        }}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={{ color: colors.background, textAlign: "center", fontFamily: "Jost_600SemiBold" }}>
          Volver al login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
