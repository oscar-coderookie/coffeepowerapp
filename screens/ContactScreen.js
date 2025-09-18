import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from "react-native";
import bckImage from '../assets/images/contacto-movil.png';
import btnEmail from '../assets/icons/email.png';
import btnInsta from '../assets/icons/insta.png';
import btnUbi from '../assets/icons/ubi.png';
import WhatsappBtn from '../assets/icons/whatsapp.png';

const EmailButton = () => {
    return (
        <TouchableOpacity style={styles.button}>
            <Image source={btnEmail} style={styles.icon} />
            <Text style={styles.text}>info@coffeepower.es</Text>
        </TouchableOpacity>
    )
};
const InstagramButton = () => {
    return (
        <TouchableOpacity style={styles.button}>
            <Image source={btnInsta} style={styles.icon} />
            <Text style={styles.text}>@coffeepower.es</Text>
        </TouchableOpacity>
    )
};
const UbicationButton = () => {
    return (
        <TouchableOpacity style={styles.button}>
            <Image source={btnUbi} style={styles.icon} />
            <Text style={styles.text}>Calle Comedias, 7 Antequera Málaga - 29200</Text>
        </TouchableOpacity>
    )
}
const WppButton = () => {
    return (
        <TouchableOpacity style={styles.button}>
            <Image source={WhatsappBtn} style={styles.icon} />
            <Text style={styles.text}>+34 620 13 21 31</Text>
        </TouchableOpacity>
    )
};

const ContactScreen = () => {
    return (
        <ImageBackground
            style={styles.container}
            source={bckImage}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <Text style={styles.text}>Encuéntranos por cualquiera de estos medios:</Text>
                <EmailButton />
                <InstagramButton />
                <WppButton />
                <UbicationButton />
            </View>
        </ImageBackground>
    )
};

export default ContactScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: '#0c0c0c3a'
    },
    text: {
        color: '#ffffffff',
        fontSize: 20,
        width: '70%',
        fontFamily: 'Jost_600SemiBold',
        textAlign: 'center'

    },
    icon: {
        width: 100,
        height: 100
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})