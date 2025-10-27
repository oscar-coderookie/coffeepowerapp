import { createStackNavigator } from "@react-navigation/stack";
import InjectCouponsScreen from "../screens/admin/MasiveDiscounts";
import PersonalDiscounts from "../screens/admin/personalDiscounts/PersonalDiscounts";
import MainDiscounts from "../screens/admin/MainDiscounts";
import Step1 from "../screens/admin/personalDiscounts/Step1";

const Stack = createStackNavigator();

export const DiscountsStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false, // puedes ponerlo en true si quieres el header automático
            }}>
            <Stack.Screen name="Principal Descuentos" component={MainDiscounts} />
            <Stack.Screen name="Descuentos Masivos" component={InjectCouponsScreen} />
            <Stack.Screen name="Descuentos Personales" component={PersonalDiscounts} />
            <Stack.Screen name="Descuentos Personales2" component={Step1} />
         
        </Stack.Navigator>
    )
};
