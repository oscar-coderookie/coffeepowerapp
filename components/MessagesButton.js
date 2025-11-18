import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUnreadMessages } from "../hooks/useUnreadMessages";
import { useTheme } from "@react-navigation/native";

export default function MessagesButton({ onPress }) {
  const unreadCount = useUnreadMessages();
  const {colors} = useTheme()

  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 10 }}>
      <Ionicons name="chatbubble-outline" size={28} color={colors.text} />
      {unreadCount > 0 && (
        <View
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            backgroundColor: "red",
            borderRadius: 10,
            paddingHorizontal: 5,
            minWidth: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
            {unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
