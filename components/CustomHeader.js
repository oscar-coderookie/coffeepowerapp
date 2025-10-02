// components/CustomHeader.js
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useTheme } from "@react-navigation/native";

export default function CustomHeader({ title, children, showBack = false }) {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View
      style={{
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        borderBottomColor: colors.border,
        borderBottomWidth: 1,
        backgroundColor: colors.background,
      }}
    >
      {/* Si showBack es true, mostramos la flecha */}
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} /> // espacio vacío
      )}

      <View style={styles.center}>
        {children ? (
          children
        ) : (
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              textTransform: "uppercase",
              textAlign: "center",
              fontFamily: "Jost_700Bold",
            }}
          >
            {title}
          </Text>
        )}
      </View>

      {/* espacio a la derecha */}
      <View style={{ width: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
