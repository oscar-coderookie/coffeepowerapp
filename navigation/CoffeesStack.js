import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OurCoffees from '../screens/OurCoffees';
import CategoryScreen from '../screens/CategoryScreen';
import CoffeeDetailScreen from '../screens/CoffeeDetailScreen';
import AccesoriesPro from '../screens/AccesoriesPro';
import CustomHeader from '../components/CustomHeader';
import MarqueeTitle from '../components/AnimatedTitle';

const Stack = createNativeStackNavigator();

export default function CoffeesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // ocultamos el header nativo del stack
      }}
    >
      {/* Pantalla principal */}
      <Stack.Screen
        name="Productos"
        component={OurCoffees}
        options={{
          headerShown: false,
        }}
      />

      {/* Categoría dinámica */}
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Detalle del café con título animado */}
      <Stack.Screen
        name="CoffeeDetail"
        component={CoffeeDetailScreen}
        options={{
          headerShown: false,
          presentation:"modal"
        }}
      />

      {/* Otra pantalla */}
    </Stack.Navigator>
  );
}
