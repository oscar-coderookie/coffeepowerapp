import { View, Text, StyleSheet, Animated, Dimensions, ImageBackground, TouchableOpacity, Alert, TextInput } from "react-native";
import { useContext, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "../context/CartContext";
import CustomHeader from "../components/CustomHeader";
import { MotiView } from 'moti';
import { Easing } from "react-native-reanimated";
import LoadingScreen from "../components/LoadingScreen";
import AddToCart from "../components/AddToCart";

const { width, height } = Dimensions.get("window");

export default function CoffeeDetailScreen({ route }) {
  const { coffee } = route.params;
  const [bgLoaded, setBgLoaded] = useState(false);
  const [section2Top, setSection2Top] = useState(0);
  // declaración recomendada (estable entre renders)
  const scrollY = useRef(new Animated.Value(0)).current;

  const translateX = scrollY.interpolate({
    inputRange: [600, 900], // ajusta según el scroll necesario
    outputRange: [width, 0],
    extrapolate: "clamp",

  });

  const translateImage = scrollY.interpolate({
    inputRange: [800, 1500],
    outputRange: [width, 0],
    extrapolate: "clamp"
  })

  const opacity = scrollY.interpolate({
    inputRange: [250, 450],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });





  return (
    <View style={{ flex: 1 }}>
      {/* 👇 Header con MarqueeTitle */}
      <CustomHeader title={coffee.name} showBack={true} />


      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.container}>
        <ImageBackground
          source={{ uri: coffee.background }}
          resizeMode="cover"
          style={styles.background}
          onLoadEnd={() => setBgLoaded(true)}
        >

          {!bgLoaded ? (<LoadingScreen />) : (
            <MotiView
              from={{ opacity: 0, translateX: -80 }}  // Empieza fuera de pantalla a la izquierda
              animate={{ opacity: 1, translateX: 0 }} // Se desliza hacia su posición final
              transition={{
                type: 'timing',
                duration: 1600, // velocidad del movimiento
                delay: 800,    // para que no entre de inmediato
                easing: Easing.out(Easing.exp), // suaviza la curva
              }}
            >
              <View style={styles.infoContainer}>
                <Text style={styles.subtitle}>Perfil Sensorial:</Text>
                {(coffee.profile ?? []).map((item, index) => (
                  <Text key={index} style={styles.desc}>
                    - {item}
                  </Text>
                ))}
              </View>
            </MotiView>

          )}


        </ImageBackground>
        <View style={styles.section2}>
          <Animated.View
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              setSection2Top(layout.y);
            }}
            style={[
              styles.section2,
              {
                transform: [{ translateX }],
                opacity,
              },
            ]}
          >

            <View style={styles.infoContainer}>
              <Text style={styles.subtitle}>👅 Notas de Cata:</Text>
              {(coffee.tasteNotes ?? []).map((item, index) => (
                <Animated.Text key={index} style={styles.desc}>
                  - {item}
                </Animated.Text>
              ))}

              <Text style={styles.subtitle}>💖 Descripción emocional:</Text>
              {(coffee.emotionalDescription ?? []).map((item, index) => (
                <Text key={index} style={styles.desc}>
                  {item}
                </Text>
              ))}
            </View>

          </Animated.View>
        </View>

        <Animated.View
          style={[styles.imageContainer]}>
          <Animated.Image

            source={{ uri: coffee.image }}
            style={[styles.package, {
              transform: [{ translateX: translateImage }],
              opacity
            }]}
            resizeMode="contain"
          />

          <AddToCart title="añadir" coffee={coffee} />
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  section2: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#000000ff'
  },
  imageContainer: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#0e0e0eff",
    paddingTop: 100,
    paddingBottom: 100,
    height: height
  },
  infoContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0c0c0c44",
  },
  background: {
    width: width,
    height: height,
    justifyContent: "center",
  },
  desc: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
    textAlign: "justify",
    width: "100%",
    fontFamily: "Jost_400Regular",
  },
  subtitle: {
    color: "#fff",
    textAlign: "left",
    marginBottom: 20,
    width: "100%",
    fontFamily: "Jost_600SemiBold",
    textTransform: "uppercase",
    fontSize: 20,
  },
  package: {
    width: width,
    height: 400,
    transform: [{ translateX: -20 }]
  },



});
