import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/HomeScreen';

const Tab = createBottomTabNavigator();

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
const Contacto = () => {
  return (
    <View style={styles.sections}>
      <Text style={{ color: '#1D1E20' }}>Contacto</Text>
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

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarIcon: () => null,
          tabBarShowLabel: true, // 👈 muestra solo el texto
           tabBarLabelStyle: {
            fontSize: 12,
            lineHeight: 16,
            width: 80,
            height: '100%'// 👈 sube el texto para centrarlo
          },
          tabBarStyle: {
            backgroundColor: "#000000",
            height: 100,
            // 👈 ajusta altura para que quede bonito
          },
          tabBarActiveTintColor: '#b6a963ff',
          tabBarInactiveTintColor: '#fff',


        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Nuestros Cafés" component={OurCoffees} />
        <Tab.Screen name="¿Quiénes Somos?" component={AccesoriosPro} />
        <Tab.Screen name="Contacto" component={Contacto} />
        <Tab.Screen name="Accesorios Pro" component={AccesoriosPro} />
      </Tab.Navigator>
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


