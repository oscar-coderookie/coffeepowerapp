import { useEffect } from "react";
import { StyleSheet, Dimensions, ImageBackground } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSpring,
    withRepeat,
    withSequence,
    Easing,
} from "react-native-reanimated";
import {
    useFonts,
    ShadowsIntoLightTwo_400Regular,
} from "@expo-google-fonts/shadows-into-light-two";
import logotipo from "../assets/images/logo-nuevo.png";
import background from '../assets/images/splash.jpg'


const { width } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
    const [fontsLoaded] = useFonts({
        ShadowsIntoLightTwo_400Regular,
    });

    // Animaciones
    const logoScale = useSharedValue(0.8);
    const logoOpacity = useSharedValue(0);
    const textOpacity = useSharedValue(0);
    const textTranslateX = useSharedValue(-width);
    const glow = useSharedValue(0.3); // 👈 intensidad del resplandor

    useEffect(() => {
        if (!fontsLoaded) return;

        // Secuencia inicial
        logoOpacity.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.exp) });
        logoScale.value = withSpring(1, { damping: 6, stiffness: 100 });

        // Texto
        textOpacity.value = withDelay(
            1000,
            withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        );
        textTranslateX.value = withDelay(
            1000,
            withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) })
        );


        // Resplandor pulsante infinito
        glow.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.3, { duration: 1200, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        const timer = setTimeout(() => {
            navigation.replace("MainDrawer");
        }, 4000);
        return () => clearTimeout(timer);
    }, [fontsLoaded]);

    const logoStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value }],
        shadowColor: "#ffffff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: glow.value,
        shadowRadius: glow.value * 16,
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateX: textTranslateX.value }],
    }));
    if (!fontsLoaded) return null;

    return (
        <ImageBackground
            source={background}
            style={styles.container}
            resizeMode="contain"
        >
            <Animated.Image
                source={logotipo}
                style={[styles.logo, logoStyle]}
                resizeMode="contain"
            />
            <Animated.Text style={[styles.textoPrincipal, textStyle]}>
                "Café selecto, momento perfecto"
            </Animated.Text>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: width * 0.65,
        height: undefined,
        aspectRatio: 1,
    },
    textoPrincipal: {
        fontSize: 20,
        color: "#f2f2f2",
        fontFamily: "ShadowsIntoLightTwo_400Regular",
        textAlign: "center",
        letterSpacing: 1,
        textShadowColor: "rgba(255,255,255,0.3)",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,
        elevation: 2,
        width: "90%",
        marginTop: 20,
    },
});
