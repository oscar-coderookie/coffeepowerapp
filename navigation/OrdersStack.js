import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrdersScreen from '../screens/admin/OrdersScreen';
import OrderDetailScreen from '../screens/admin/OrderDetailScreen';

const Stack = createNativeStackNavigator();

export default function OrdersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // ocultamos el header nativo del stack
      }}
    >
      {/* Pantalla principal */}
      <Stack.Screen
        name="Pedidos"
        component={OrdersScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Categoría dinámica */}
      <Stack.Screen
        name="Detalle pedido"
        component={OrderDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
