import { View, Text, StyleSheet, Image, ScrollView, Dimensions, ImageBackground } from "react-native";
import Header from "../components/CustomHeader";
import MarqueeTitle from "../components/AnimatedTitle";

const { width, height } = Dimensions.get("window");

export default function CoffeeDetailScreen({ route }) {
  const { coffee } = route.params;

  return (
    <View style={{ flex: 1 }}>
      {/* 👇 Header con MarqueeTitle */}
      <Header>
        <MarqueeTitle title={coffee.name} />
      </Header>

      <ScrollView contentContainerStyle={styles.container}>
        <ImageBackground
          source={coffee.background}
          resizeMode="cover"
          style={styles.background}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.subtitle}>Perfil Sensorial:</Text>
            {coffee.profile?.length > 0 &&
              coffee.profile.map((item, index) => (
                <Text key={index} style={styles.desc}>
                  - {item}
                </Text>
              ))}
          </View>
        </ImageBackground>

        <View style={styles.section2}>
          <View style={styles.infoContainer}>
            <Text style={styles.subtitle}>👅 Notas de Cata:</Text>
            {coffee.tasteNotes?.length > 0 &&
              coffee.tasteNotes.map((item, index) => (
                <Text style={styles.desc} key={index}>
                  - {item}
                </Text>
              ))}

            <Text style={styles.subtitle}>💖 Descripción emocional:</Text>
            {coffee.emotionalDescription?.length > 0 &&
              coffee.emotionalDescription.map((item, index) => (
                <Text style={styles.desc} key={index}>
                  {item}
                </Text>
              ))}
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image style={styles.package} source={coffee.image} />
        </View>
      </ScrollView>
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
    paddingBottom: 100,
  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: "#0e0e0eff",
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
    width: "80%",
    resizeMode: "contain",
  },
});
