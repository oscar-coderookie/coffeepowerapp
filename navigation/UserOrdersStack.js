import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrderDetailScreen from '../screens/admin/OrderDetailScreen';
import UserOrdersScreen from '../screens/user/UserOrdersScreen';
import UserOrderDetailScreen from '../screens/user/UserOrderDetailScreen';

const Stack = createNativeStackNavigator();

export default function UserOrdersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // ocultamos el header nativo del stack
      }}
    >
      {/* Pantalla principal */}
      <Stack.Screen
        name="Listado Pedidos cliente"
        component={UserOrdersScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Categoría dinámica */}
      <Stack.Screen
        name="Detalle pedido cliente"
        component={UserOrderDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}