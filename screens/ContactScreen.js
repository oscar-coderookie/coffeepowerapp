import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from "react-native";
import { MotiView } from "moti";
import bckImage from "../assets/images/webp/contacto-movil.webp";
import btnEmail from "../assets/icons/email.webp";
import btnInsta from "../assets/icons/insta.webp";
import btnUbi from "../assets/icons/ubi.webp";
import WhatsappBtn from "../assets/icons/whatsapp.webp";
import LoadingScreen from "../components/LoadingScreen";

const AnimatedButton = ({ source, text, delay }) => (
  <MotiView
    from={{ opacity: 0, translateX: -100 }} // 👈 entra desde la izquierda
    animate={{ opacity: 1, translateX: 0 }}
    transition={{ type: "timing", duration: 600, delay }}
  >
    <TouchableOpacity style={styles.button}>
      <Image source={source} style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  </MotiView>
);

const ContactScreen = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen />}
      <ImageBackground
        style={styles.container}
        source={bckImage}
        imageStyle={{ width: "100%", height: "100%" }}
        resizeMode="cover"
        onLoadEnd={() => setLoading(false)} // 👈 quita el loader cuando la imagen está lista
      >
        {!loading && (
          <View style={styles.overlay}>
            <MotiView
              from={{ opacity: 0, translateY: -10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 800 }}
            >
              <Text style={styles.legend}>Encuéntranos por cualquiera de estos medios:</Text>
            </MotiView>

            <AnimatedButton source={btnEmail} text="info@coffeepower.es" delay={300} />
            <AnimatedButton source={btnInsta} text="@coffeepower.es" delay={600} />
            <AnimatedButton source={WhatsappBtn} text="+34 620 13 21 31" delay={900} />
            <AnimatedButton
              source={btnUbi}
              text="Calle Comedias, 7 Antequera Málaga - 29200"
              delay={1200}
            />
          </View>
        )}
      </ImageBackground>
    </>
  );
};

export default ContactScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        width: '80%',
        fontFamily: 'Jost_600SemiBold',
        textAlign: 'left'
    },
    icon: {
        width: 100,
        height: 100
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    legend: {
        color: '#fff',
        fontFamily: 'Jost_400Regular',
        fontSize: 16,
        marginBottom: 10
    }
});
