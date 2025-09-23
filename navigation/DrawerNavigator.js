// navigators/DrawerNavigator.js
import { createDrawerNavigator } from "@react-navigation/drawer";
import CoffeesStack from "./CoffeesStack";
import AboutUsScreen from "../screens/AboutUsScreen";
import RootNavigator from "./RootNavigator";
import Tabs from "./TabNavigator";
import logo from '../assets/images/logo.png'
import { Image } from "react-native";
const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: "#111" },
                headerTintColor: "#fff",
                drawerStyle: { backgroundColor: "#222" }, // fondo del menú
                drawerActiveTintColor: "#fff",
                drawerInactiveTintColor: "#aaa",
                drawerLabelStyle: { fontFamily: "Jost_600SemiBold" },
                headerRight: () => (
                    <Image
                        source={logo}
                        style={{  width: 102.5, height: 37.5 , marginRight: 15 }}
                    />
                ),
                headerTitle: ''
            }}
        >
            <Drawer.Screen name="Principal" component={Tabs} />
        </Drawer.Navigator>
    );
}
