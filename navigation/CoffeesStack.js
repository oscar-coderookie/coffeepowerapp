import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OurCoffees from '../screens/OurCoffees';
import CategoryScreen from '../screens/CategoryScreen'; // la pantalla detalle genérica
import CoffeeDetailScreen from '../screens/CoffeeDetailScreen';
import MarqueeTitle from '../components/AnimatedTitle';

const Stack = createNativeStackNavigator();

export default function CoffeesStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: "#111", height: 100 },
      headerTintColor: "#fff", // color de la flecha y texto
      headerTitleStyle: { fontFamily: "Jost_600SemiBold", fontSize: 18 },
      headerBackTitle: 'Atrás',
      headerBackTitleStyle: { fontFamily: "Jost_600SemiBold", textTransform: 'uppercase' },
    }}>

      <Stack.Screen name="SELECCIONES" component={OurCoffees} />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={({ route }) => ({
          title: route.params?.category?.name.toUpperCase(),
        })}
      />


      <Stack.Screen
        name="CoffeeDetail"
        component={CoffeeDetailScreen}
        options={({ route }) => ({
          headerTitle: () => (
            <MarqueeTitle gap={20} title={route.params?.coffee?.name.toUpperCase()} />
          ),
        })}
      />
    </Stack.Navigator>
  );
}