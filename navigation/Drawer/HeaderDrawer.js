// navigation/Drawer/HeaderDrawer.js
import { View, Image, TouchableOpacity } from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { playSound } from "../../utils/soundPlayer";
import logoMenu from "../../assets/images/logo-nuevo.png";
import cartIcon from "../../assets/icons/cart.png";

export default function HeaderDrawer() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return {
    headerBackground: () => (
      <LinearGradient
        colors={[colors.card, colors.card, colors.gray, colors.card, colors.card]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      />
    ),

    headerTitle: () => (
      <Image
        source={logoMenu}
        style={{
          width: 60,
          height: 60,
          resizeMode: "contain",
          shadowColor: "#d4d4d4ff",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.9,
          shadowRadius: 1,
          elevation: 1,
        }}
      />
    ),

    headerRight: () => (
      <View style={{ height: 70, justifyContent: "center" }}>
        <TouchableOpacity
          onPress={() => {
            playSound("click");
            navigation.navigate("MainDrawer", { screen: "CartScreen" });
          }}
          style={{
            marginRight: 15,
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={cartIcon}
            style={{ width: 50, height: 50 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    )
  };
}
