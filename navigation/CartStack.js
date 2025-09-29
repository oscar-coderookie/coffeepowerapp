
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ShopCart from "../screens/ShopCart";
import PayoutScreen from "../screens/PayoutScreen";
const Stack = createNativeStackNavigator();

const CartStack =()=>{
  return(
    <Stack.Navigator
      screenOptions={{
        headerShown:false,
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen 
        name="Cart" 
        component={ShopCart} 
        options={{ title: "Tu carrito" }}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen} 
        options={{ title: "Finalizar pedido" }}
      />
       <Stack.Screen 
        name="Payout" 
        component={PayoutScreen} 
        options={{ title: "Finalizar pedido" }}
      />
    </Stack.Navigator>
  )
};

export default CartStack;