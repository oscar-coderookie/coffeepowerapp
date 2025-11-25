// navigation/stacks/UserSettingsStack.jsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserSettings from "../screens/user/UserSettings";
import EditAddressScreen from "../screens/user/EditAddressScreen";

const Stack = createNativeStackNavigator();

const UserSettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserSettingsMain"
        component={UserSettings}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditAddressScreen"
        component={EditAddressScreen}
        options={{
          headerShown: false, // ya usas tu CustomHeader
          animation: "slide_from_right",
        }}
      />
    </Stack.Navigator>
  );
};

export default UserSettingsStack;
