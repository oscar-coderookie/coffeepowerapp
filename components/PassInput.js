import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"

const PassInput = ({password, setPassword}) => {

      const [showPassword, setShowPassword] = useState(false);
      const {colors} = useTheme();
    return (
        <View style={styles.passwordContainer}>
            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={{
                    flex: 1,
                    fontFamily: "Jost_400Regular",
                    borderWidth: 1,
                    color: colors.text,
                    borderColor: colors.text,
                    padding: 10,
                    borderRadius: 8,
                }}
                placeholderTextColor={colors.text}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showButton}>
                <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color={colors.text}
                />
            </TouchableOpacity>
        </View>
    )
};

export default PassInput;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start", padding: 20, marginTop: 100 },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  showButton: {
    position: "absolute",
    right: 10,
  },
});
