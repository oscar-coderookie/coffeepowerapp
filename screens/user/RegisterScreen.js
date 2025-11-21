import { useTheme } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import ButtonGeneral from "../../components/ButtonGeneral";
import CustomHeader from "../../components/CustomHeader";
import Toast from "react-native-toast-message";

export default function RegisterScreen({ navigation }) {
  const { colors } = useTheme();
  const { register } = useContext(AuthContext)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Por favor completa todos los campos",
      });
      return;
    }

    setLoading(true);

    try {
      const user = await register(name, email, password);
      if (!user) return;

      Toast.show({
        type: "success",
        text1: "Registro Exitoso",
        text2: "Verifica tu correo...",
      });

    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }

  };


  return (
    <View style={styles.container}>
      <CustomHeader title="registro:" />
      <View style={{ marginHorizontal: 10, marginTop: 20 }}>
        <Text style={{ fontFamily: 'Jost_400Regular', textAlign: 'justify', marginBottom: 10, color: colors.text }}>Diligencia todos los campos para efectuar el registro en nuestra app:</Text>
        <TextInput
          placeholder="Nombre completo"
          value={name}
          onChangeText={setName}
          style={[
            styles.input,
            { borderColor: colors.text, color: colors.text },
          ]}
          placeholderTextColor={colors.text}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={[
            styles.input,
            { borderColor: colors.text, color: colors.text },
          ]}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.text}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={[
              styles.input,
              {
                flex: 1,
                borderColor: colors.text,
                color: colors.text,
              },
            ]}
            placeholderTextColor={colors.text}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.showButton}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        <ButtonGeneral
          text={loading ? "Creando cuenta..." : "Registrarse"}
          textColor="white"
          bckColor={[
            "#000000ff",
            "#535353ff",
            "#000000ff",
            "#6b6b6bff",
            "#000000ff",
          ]}
          borderColors={[
            "#535353ff",
            "#000000ff",
            "#535353ff",
            "#000000ff",
            "#535353ff",
          ]}
          onTouch={handleRegister}
          disabled={loading}
        />

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: {
    fontFamily: "Jost_400Regular",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  showButton: {
    position: "absolute",
    right: 10,
    bottom: 20
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#0066cc",
    fontFamily: "Jost_400Regular",
  },
});
