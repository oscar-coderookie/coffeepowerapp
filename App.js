import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//Screens:
import HomeScreen from './screens/HomeScreen';
import AboutUsScreen from './screens/AboutUsScreen';
import ContactScreen from './screens/ContactScreen';
//Iconos e Imágenes:
import icon1 from './assets/icons/menu-1.png';
import icon2 from './assets/icons/menu-2.png';
import icon3 from './assets/icons/menu-3.png';
import icon4 from './assets/icons/menu-4.png';
import logo from './assets/images/logo.png'



const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "black", // 👈 Fondo negro global
  },
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const OurCoffees = () => {
  return (
    <View style={styles.sections}>
      <Text style={{ color: '#1D1E20' }}>Nuestros Cafés</Text>
    </View>
  )
};
const QuienSomos = () => {
  return (
    <View style={styles.sections}>
      <Text style={{ color: '#1D1E20' }}>¿Quiénes somos?</Text>
    </View>
  )
};
const AccesoriosPro = () => {
  return (
    <View style={styles.sections}>
      <Text style={{ color: '#1D1E20' }}>Accesorios Pro</Text>
    </View>
  )
};

const Tabs = () => {
  return (
    <Tab.Navigator

      screenOptions={{

        headerShown: false, // el header lo manejamos desde el stack
        tabBarStyle: { backgroundColor: "#000000ff", height: 90 },
        tabBarActiveTintColor: "#9c9256ff",
        tabBarInactiveTintColor: "#fff",
        tabBarLabelStyle: { fontSize: 12, marginTop: 4, fontWeight: 300, textTransform: 'uppercase' }, // 👈 mueve el label
        tabBarIconStyle: { marginTop: 6 },
        borderTopWidth: 0,       // 👈 quita la línea/borde superior
        elevation: 0,            // 👈 Android: elimina sombra
        shadowOpacity: 0,
      }}

    >
      <Tab.Screen
        name="Nuestros Cafés"
        component={OurCoffees}
        options={{
          tabBarIcon: () => (
            <Image
              source={icon1}
              style={{
                width: 40,
                height: 40,

              }}

            />
          )
        }} />
      <Tab.Screen name="¿Quiénes Somos?" component={AboutUsScreen} options={{
        tabBarIcon: () => (
          <Image
            source={icon4}
            style={{
              width: 40,
              height: 40,
            }}
          />
        )
      }} />
      <Tab.Screen name="Accesorios Pro" component={AccesoriosPro} options={{
        tabBarIcon: () => (
          <Image
            source={icon2}
            style={{
              width: 40,
              height: 40,

            }}

          />
        )
      }} />
      <Tab.Screen name="Contacto" component={ContactScreen} options={{
        tabBarIcon: () => (
          <Image
            source={icon3}
            style={{
              width: 40,
              height: 40,

            }}

          />
        )
      }} />
    </Tab.Navigator>
  )
};
const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={({ navigation }) => ({
          title: null,
          headerStyle: { backgroundColor: "#000000ff" },
          headerTintColor: "#fff",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={{ marginLeft: 15 }}
            >
              <Image source={logo} style={{ width: 102.5, height: 37.5 }} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <MainStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sections: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});


