import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OurCoffees from '../screens/OurCoffees';
import CategoryScreen from '../screens/CategoryScreen'; // la pantalla detalle genérica

const Stack = createNativeStackNavigator();

export default function CoffeesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OurCoffees" component={OurCoffees} />
      <Stack.Screen name="Category" component={CategoryScreen} />
    </Stack.Navigator>
  );
}