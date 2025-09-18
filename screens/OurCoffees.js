import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    ImageBackground,
    TouchableOpacity
} from "react-native";
import imageBck from '../assets/images/nuestros-cafes.png'

const subcategories = [
    { name: "Los Más Vendidos", legend: '"No se agotan por casualidad. ¡Descubre por qué todos los eligen!"' },
    { name: 'Coffee Power Selection', legend: '"Nuestra élite secreta. Café para los que buscan lo más potente."' },
    { name: 'Esencia de Colombia', legend: '"Sabor auténtico desde el corazón cafetero del mundo."' },
    { name: 'Los favoritos del Chef', legend: '"Si el chef los prefiere... será por algo. Pura excelencia en taza."' },
    { name: 'Ecológicos', legend: '"Cuidamos el planeta, sin renunciar al placer. Elige consciente, saborea mejor."' },
    { name: 'Recetas Exclusivas del Día', legend: '"Ediciones limitadas. Sabor único que no se repite. ¿Te atreves hoy?"' },
    { name: 'Descafeinados de Élite', legend: '"Sin cafeína, con todo el carácter. Descubre lo que nadie te contó."' },
    { name: 'Viajar por el Mundo', legend: '"Explora el mundo sin moverte de tu taza. Cada país, una historia. Cada sorbo, un destino."' },
    { name: 'Tesoros Escondidos', legend: '"Cafés que nadie conoce... aún. Solo para exploradores de verdad."' }
]

const OurCoffees = () => {
    return (
        <ImageBackground source={imageBck} style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title} >Nuestros Cafés</Text>

                <View style={styles.mosaic}>
                    {subcategories.map((item, index) => (
                        <TouchableOpacity style={styles.card} key={index}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.legend}>{item.legend}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </ImageBackground>
    )
};

export default OurCoffees

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover', // se ajusta al tamaño de pantalla
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100
    },
    title: {
        fontSize: 28,
        fontWeight: "500",
        fontFamily: 'Jost_600SemiBold',
        color: "#fff",
        textTransform:'uppercase',
        textAlign: "center",
        marginBottom: 40,
        textShadowColor: "rgba(0,0,0,0.7)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 6,
    },
    mosaic: {
        flexDirection: "column",
        gap: 16,
    },
    card: {
        backgroundColor: "rgba(0, 0, 0, 0.45)", // un poco de transparencia para leer bien el texto
        borderRadius: 12,
        padding: 16,
          backdropFilter: "blur(8px)",
    },
    cardTitle: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: "500",
        fontFamily: 'Jost_600SemiBold',
        textTransform:'capitalize',
        color: "#fff",
        marginBottom: 8,
    },
    legend: {
        fontSize: 16,
        fontFamily:'Jost_400Regular',
        textAlign: 'center',
        color: "#ccc",
    }
});