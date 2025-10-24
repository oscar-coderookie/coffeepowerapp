import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminCatalogScreen from "../screens/admin/AdminCatalogScreen";
import EditCoffeeScreen from "../screens/admin/EditCoffeeScreen";
import AddCoffeeScreen from "../screens/admin/AddCoffeeScreen";

const Stack = createNativeStackNavigator();

export default function AdminStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // puedes ponerlo en true si quieres el header automático
      }}
    >
      <Stack.Screen name="AdminCatalog" component={AdminCatalogScreen} />
      <Stack.Screen name="EditCoffee" component={EditCoffeeScreen} />
      <Stack.Screen name="AddCoffee" component={AddCoffeeScreen} />
    </Stack.Navigator>
  );
}
