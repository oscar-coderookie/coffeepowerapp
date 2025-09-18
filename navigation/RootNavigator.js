import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Image } from 'react-native';
import Tabs from './TabNavigator';
import homeIcon from '../assets/images/logo.png';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#000" }, headerTintColor: "#fff" }}>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={({ navigation, route }) => {
          // ruta activa dentro del Tab
          const currentRoute = route?.state?.routes[route.state.index]?.name;

          return {
            headerTitle: "",
            headerLeft: () =>
              currentRoute !== "HomeScreen" ? (
                <TouchableOpacity >
                  <Image source={homeIcon} style={{ width: 102.5, height: 37.5 }} />
                </TouchableOpacity>
              ) : null,
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;