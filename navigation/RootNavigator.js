import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Image } from 'react-native';
import Tabs from './TabNavigator';
import homeIcon from '../assets/images/logo.png';
import HomeScreen from '../screens/HomeScreen';
import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {

  return (
    <Stack.Navigator screenOptions={{  headerStyle: { backgroundColor: "#000" }, headerTintColor: "#fff" }}>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={({ navigation, route }) => {
          // ruta activa dentro del Tab
          const currentRoute = route?.state?.routes[route.state.index]?.name;
          return {
            headerTitle: "",
            headerLeft: () =>
                <TouchableOpacity>
                  <Image source={homeIcon} style={{ width: 102.5, height: 37.5 }} />
                </TouchableOpacity>
             
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;