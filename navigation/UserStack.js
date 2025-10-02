import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import UserAreaScreen from "../screens/UserAreaScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import ForgotPasswordScreen from "../screens/ForgotPassword";

const Stack = createNativeStackNavigator();

const UserStack = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await AsyncStorage.getItem("userSession");
        if (session) {
          setInitialRoute("UserArea"); // si hay sesión → área cliente
        } else {
          setInitialRoute("Login"); // si no hay sesión → login
        }
      } catch (error) {
        console.log("Error leyendo sesión:", error);
        setInitialRoute("Login");
      }
    };

    checkSession();
  }, []);

  // Mientras revisa sesión mostramos un loader
  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="UserArea" component={UserAreaScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default UserStack;
