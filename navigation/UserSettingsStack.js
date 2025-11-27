// navigation/stacks/UserSettingsStack.jsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserSettings from "../screens/user/UserSettings";
import EditAddressScreen from "../screens/user/EditAddressScreen";
import NewAddressScreen from "../screens/user/userArea/NewAddressScreen";
import ChangeEmailScreen from "../screens/user/userArea/ChangeEmailScreen";
import ChangePassScreen from "../screens/user/userArea/ChangePassScreen";

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
       <Stack.Screen
        name="NewAdress"
        component={NewAddressScreen}
        options={{
          headerShown: false, // ya usas tu CustomHeader
          animation: "slide_from_right",
        }}
      />
       <Stack.Screen
        name="ChangeEmail"
        component={ChangeEmailScreen}
        options={{
          headerShown: false, // ya usas tu CustomHeader
          animation: "slide_from_right",
        }}
      />
        <Stack.Screen
        name="ChangePass"
        component={ChangePassScreen}
        options={{
          headerShown: false, // ya usas tu CustomHeader
          animation: "slide_from_right",
        }}
      />
    </Stack.Navigator>
  );
};

export default UserSettingsStack;
