import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import RegisterScreen from "../screens/user/RegisterScreen";
import LoginScreen from "../screens/user/LoginScreen";
import UserTabs from "./UserTabs";
import ForgotPasswordScreen from "../screens/user/ForgotPassword";

const Stack = createNativeStackNavigator();

const UserStack = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="UserArea" component={UserTabs} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default UserStack;
