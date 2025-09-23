import { View, Text, StyleSheet, Image, ScrollView, Dimensions, ImageBackground } from "react-native";

const { width, height } = Dimensions.get("window");

export default function CoffeeDetailScreen({ route }) {
  const { coffee } = route.params; // 👈 recibimos el café

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={coffee.background}
        resizeMode="cover"
        style={styles.background}>
        <View style={styles.infoContainer}>
          <Text style={styles.subtitle}>Perfil Sensorial:</Text>
          {coffee.profile && coffee.profile.length > 0 ? (
            coffee.profile.map((item, index) => (
              <Text key={index} style={styles.desc}>
                - {item}
              </Text>
            ))
          ) : null}
        </View>
      </ImageBackground>
      <View style={styles.section2}>
        <View style={styles.infoContainer}>
          <Text style={styles.subtitle}>👅 Notas de Cata:</Text>
          {coffee.tasteNotes && coffee.tasteNotes.length > 0 ? (
            coffee.tasteNotes.map((item, index) => (
              <Text style={styles.desc} key={index}>- {item}</Text>
            ))
          ) : null}
          <Text style={styles.subtitle}>💖 Descripción emocional:</Text>
          {coffee.emotionalDescription && coffee.emotionalDescription.length > 0 ? (
            coffee.emotionalDescription.map((item, index) => (
              <Text style={styles.desc} key={index}>
                {item}
              </Text>
            ))
          ) : null}
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image style={styles.package} source={coffee.image} />
      </View>
    </ScrollView>
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
    alignItems: 'center',
    backgroundColor: '#0e0e0eff',
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0c0c0c44'
  },
  image: {
    justifyContent: 'center'
  },
  background: {
    width: width,
    height: height,   // 👈 ocupa toda la pantalla
    justifyContent: 'center'
  },
  imgContainer: {
    width: '100%',
    justifyContent: 'center'
  },
  name: {
    fontSize: 26,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    width: '100%',
    fontFamily: 'Jost_600SemiBold',
    textTransform: 'uppercase'
  },
  desc: {
    fontSize: 16,
    color: "#ffffffff",
    marginBottom: 20,
    textAlign: "justify",
    width: '100%',
    fontFamily: 'Jost_400Regular',
  },
  subtitle: {
    color: "#fff",
    textAlign: "left",
    marginBottom: 20,
    width: '100%',
    fontFamily: 'Jost_600SemiBold',
    textTransform: 'uppercase',
    fontSize: 20
  },
  package: {
    width: '80%',
    resizeMode: 'contain'
  }
});
