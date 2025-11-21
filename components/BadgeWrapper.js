import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BadgeWrapper({
  iconName,               // si usas Ionicons
  IconLib = Ionicons,     // librería de icons
  pngSource,              // si usas PNG
  size = 28,
  color = "#000",
  badgeCount = 0,
}) {
  return (
    <View style={{ width: size, height: size }}>
      {pngSource ? (
        <Image
          source={pngSource}
          style={{ width: size, height: size, resizeMode: "contain" }}
        />
      ) : (
        <IconLib name={iconName} size={size} color={color} />
      )}

      {badgeCount > 0 && (
        <View
          style={{
            position: "absolute",
            right: -6,
            top: -4,
            backgroundColor: "red",
            borderRadius: 10,
            minWidth: 18,
            height: 18,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 3,
          }}
        >
          <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
            {badgeCount > 9 ? "9+" : badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
}
