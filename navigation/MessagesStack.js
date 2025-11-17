import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessageDetailScreen from "../screens/user/MessageDetailScreen";
import UserMessagesScreen from "../screens/user/UserMessagesScreen";

const Stack = createNativeStackNavigator();

export default function MessagesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MessageList"
        component={UserMessagesScreen}
        options={{ headerShown:false }}
      />
      <Stack.Screen
        name="Detalle Mensaje"
        component={MessageDetailScreen}
       options={{ headerShown:false }}
        
      />
    </Stack.Navigator>
  );
}
