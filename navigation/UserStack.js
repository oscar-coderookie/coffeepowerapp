import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import UserAreaScreen from "../screens/UserAreaScreen";
import ForgotPasswordScreen from "../screens/ForgotPassword";
import UserTabs from "./UserTabs";

import { auth } from "../config/firebase";

const Stack = createNativeStackNavigator();

const UserStack = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    // Escucha cambios en la sesión de Firebase
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setInitialRoute("UserArea"); // Usuario logueado → área personal
      } else {
        setInitialRoute("Login"); // No hay usuario → login
      }
    });

    return () => unsubscribe(); // limpiar listener al desmontar
  }, []);

  // Mientras detecta la sesión mostramos loader
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
      <Stack.Screen name="UserArea" component={UserTabs} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default UserStack;
