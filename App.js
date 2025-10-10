import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import {
  Jost_100Thin,
  Jost_200ExtraLight,
  Jost_300Light,
  Jost_400Regular,
  Jost_500Medium,
  Jost_600SemiBold,
  Jost_700Bold,
  Jost_800ExtraBold,
  Jost_900Black,
  Jost_100Thin_Italic,
  useFonts
} from '@expo-google-fonts/jost';
import DrawerNavigator from './navigation/DrawerNavigator';
import ErrorBoundary from './error/ErrorBoundary';
import { CartProvider } from './context/CartContext';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';

function MainApp() {
  const { theme } = useThemeContext();

  return (
    <NavigationContainer theme={theme}>
      <DrawerNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    Jost_100Thin,
    Jost_200ExtraLight,
    Jost_300Light,
    Jost_400Regular,
    Jost_500Medium,
    Jost_600SemiBold,
    Jost_700Bold,
    Jost_800ExtraBold,
    Jost_900Black,
    Jost_100Thin_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <ThemeProvider>
              <MainApp />
            </ThemeProvider>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});