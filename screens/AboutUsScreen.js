import { View, Text, StyleSheet, Image, ScrollView, Dimensions, ImageBackground, Animated } from "react-native";
import aboutUsImgMovil from "../assets/images/aboutus-movil.jpg";
import VideoPlayer from "../components/VideoPlayer";
import { useTheme } from "@react-navigation/native";
import { useRef } from "react";

const screenHeight = Dimensions.get("window").height;

const { width, height } = Dimensions.get("window");

const AboutUsScreen = () => {
    const { colors } = useTheme();
    const scrollY = useRef(new Animated.Value(0)).current;

    const translateX = scrollY.interpolate({
        inputRange: [900, 1400], // ajusta según el scroll necesario
        outputRange: [width, 0],
        extrapolate: "clamp",

    });
    const translate2 = scrollY.interpolate({
        inputRange: [1000, 1500], // ajusta según el scroll necesario
        outputRange: [width, 0],
        extrapolate: "clamp",

    });
    const translate3 = scrollY.interpolate({
        inputRange: [1100, 1600], // ajusta según el scroll necesario
        outputRange: [width, 0],
        extrapolate: "clamp",

    });
     const translate4 = scrollY.interpolate({
        inputRange: [1200, 1700], // ajusta según el scroll necesario
        outputRange: [width, 0],
        extrapolate: "clamp",

    });
    const opacity = scrollY.interpolate({
        inputRange: [250, 450],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    return (

        <Animated.ScrollView contentContainerStyle={{
            backgroundColor: '#000000ff'
        }}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
            )}
            scrollEventThrottle={16}>
            <VideoPlayer />
            <View style={styles.container}>
                <ImageBackground resizeMode="cover" source={aboutUsImgMovil} style={styles.image}>
                    <Text style={styles.section}>
                        ¿Quiénes Somos?
                    </Text>
                </ImageBackground>
            </View>
            <View style={styles.bio}>
                <Animated.Text style={[styles.paragraph, {
                    transform: [{ translateX:translateX }],
                    opacity,
                },]}>
                    Somos una empresa familiar que nace de la pasión profunda por el café y la nutrición.
                    Seleccionamos cuidadosamente granos 100% arábica provenientes de fincas exclusivas de
                    Colombia y de los países más prestigiosos del trópico cafetero mundial, esas tierras
                    legendarias que presumen de cultivar el café más exquisito del planeta.
                </Animated.Text>

                <Animated.Text
                    style={[styles.paragraph, {
                        transform: [{ translateX: translate2 }],
                        opacity,
                    }]}>
                    Nuestro viaje comenzó con un sueño claro: descubrir el café perfecto, aquel que no solo
                    deleita el paladar, sino que también aporta bienestar. Tras años recorriendo el mundo,
                    aprendiendo y experimentando, hemos creado recetas únicas y exclusivas, fruto de una
                    minuciosa selección de los granos más excepcionales de cada región, fusionando sus sabores
                    en armonías inigualables. Esta pasión por la excelencia ha llevado a muchos de nuestros
                    amigos y clientes a definir a Coffee Power como "el café de los Dioses".
                </Animated.Text>

                <Animated.Text style={[styles.paragraph, {
                        transform: [{ translateX: translate3 }],
                        opacity,
                    }]}>
                    En Coffee Power estamos constantemente innovando y explorando nuevos ratios y métodos de
                    extracción. Actualmente, trabajamos en una técnica revolucionaria y única que llevará la
                    experiencia del café a un nivel nunca antes visto, con la visión de convertirla en una
                    referencia mundial, tal como ocurrió con el Espresso (Italia, 1901) o la Prensa Francesa
                    (Francia, 1929).
                </Animated.Text>

                <Animated.Text style={[styles.paragraph,{
                        transform: [{ translateX: translate4 }],
                        opacity,
                    }]}>
                    Cada sorbo de Coffee Power te transporta a un universo sensorial único e irrepetible,
                    fruto de una dedicación absoluta y un compromiso inquebrantable con la calidad. Porque
                    Coffee Power no es solo café: es nuestra pasión convertida en arte por un artista que
                    pronto descubrirás.
                </Animated.Text>
            </View>
        </Animated.ScrollView>

    );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        textTransform: "uppercase",
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        marginBottom: 40,

    },
    bio: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
        marginTop: 100,
        marginBottom: 40,
    },
    paragraph: {
        color: "#fff",
        textAlign: "justify",
        fontFamily: 'Jost_400Regular',
        marginBottom: 15,
        width: '90%',
        fontSize: 16
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: screenHeight
    },
    container: {
        flex: 1
    },
    section: {
        color: 'white',
        fontSize: 38,
        lineHeight: 84,
        fontFamily: 'Jost_600SemiBold',
        textAlign: 'center',
        backgroundColor: '#00000071',
    }
});