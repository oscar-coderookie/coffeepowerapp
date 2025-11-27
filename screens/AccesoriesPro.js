import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    ImageBackground,
    TouchableOpacity
} from "react-native";
import BckImage from '../assets/images/webp/accesorios-pro.webp'

const AccesoriesPro = () => {
    return (
        <ImageBackground source={BckImage} style={styles.block}>
            <Text style={styles.text}>
                Accesorios Pro
            </Text>
            <Text style={styles.legend}>
                Próximamente....
            </Text>
        </ImageBackground>
    )
};

export default AccesoriesPro;

const styles = StyleSheet.create({
    block: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center'
    },
    text: {
        color: 'white',
        fontSize: 38,
        lineHeight: 84,
        fontFamily: 'Jost_600SemiBold',
        textAlign: 'center',
        backgroundColor: '#00000071',
    },
    legend: {
         color: 'white',
        fontSize: 28,
        fontFamily: 'Jost_400Regular',
        textAlign: 'center',
        backgroundColor: '#00000071',
    }
})