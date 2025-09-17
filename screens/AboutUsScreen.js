import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from "react-native";

import aboutUsImgMovil from "../assets/images/aboutus-movil.jpg";

const screenWidth = Dimensions.get("window").height;

const AboutUsScreen = () => {
    return (

        <ScrollView contentContainerStyle={styles.block}>

            <Image source={aboutUsImgMovil} style={styles.image} />

            <Text style={styles.title}>¿Quiénes somos?</Text>

            <Text style={styles.paragraph}>
                Somos una empresa familiar que nace de la pasión profunda por el café y la nutrición.
                Seleccionamos cuidadosamente granos 100% arábica provenientes de fincas exclusivas de
                Colombia y de los países más prestigiosos del trópico cafetero mundial, esas tierras
                legendarias que presumen de cultivar el café más exquisito del planeta.
            </Text>

            <Text style={styles.paragraph}>
                Nuestro viaje comenzó con un sueño claro: descubrir el café perfecto, aquel que no solo
                deleita el paladar, sino que también aporta bienestar. Tras años recorriendo el mundo,
                aprendiendo y experimentando, hemos creado recetas únicas y exclusivas, fruto de una
                minuciosa selección de los granos más excepcionales de cada región, fusionando sus sabores
                en armonías inigualables. Esta pasión por la excelencia ha llevado a muchos de nuestros
                amigos y clientes a definir a Coffee Power como "el café de los Dioses".
            </Text>

            <Text style={styles.paragraph}>
                En Coffee Power estamos constantemente innovando y explorando nuevos ratios y métodos de
                extracción. Actualmente, trabajamos en una técnica revolucionaria y única que llevará la
                experiencia del café a un nivel nunca antes visto, con la visión de convertirla en una
                referencia mundial, tal como ocurrió con el Espresso (Italia, 1901) o la Prensa Francesa
                (Francia, 1929).
            </Text>

            <Text style={styles.paragraphFinal}>
                Cada sorbo de Coffee Power te transporta a un universo sensorial único e irrepetible,
                fruto de una dedicación absoluta y un compromiso inquebrantable con la calidad. Porque
                Coffee Power no es solo café: es nuestra pasión convertida en arte por un artista que
                pronto descubrirás.
            </Text>

        </ScrollView>

    );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row", // web style
        backgroundColor: "black",
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgSection: {
        width: "100%",
        height: "100%",
    },
    block: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#000000'
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        textTransform: "uppercase",
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        marginBottom: 40,
        marginTop: 100,
    },
    paragraph: {
        color: "#fff",
        textAlign: "justify",
        marginBottom: 15,
        width: '90%'
    },
    paragraphFinal: {
        paddingBottom: 100,
        color: "#fff",
        textAlign: "justify",
        marginBottom: 15,
        width: '90%'
    },
    image: {
        resizeMode: 'contain',
        height: screenWidth
    }
});