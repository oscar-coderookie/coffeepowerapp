import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerNavigator from "./DrawerNavigator";

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#6200ee" },
        headerTintColor: "#fff",
        // si quieres ocultar el header para ciertas pantallas, puedes usar `headerShown: false`
      }}
    >
      <Stack.Screen
        name="Main"
        component={DrawerNavigator}
        options={{
          title: "Mi App",
          headerShown: true,
        }}
      />
      {/* puedes agregar pantallas que estén fuera del Drawer/Tab si las necesitas */}
    </Stack.Navigator>
  );
}
