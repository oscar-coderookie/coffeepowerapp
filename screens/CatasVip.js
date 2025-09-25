import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import imageBck from "../assets/images/catas-movil.webp";
import iconBasic from "../assets/images/catas-inicial.png";
import iconIntermediate from "../assets/images/catas-intermediate.png";
import iconVip from "../assets/images/catas-exclusive.png";

const TastingOption = ({ image, title, duration, content, benefits }) => {
  const [showContent, setShowContent] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);

  return (
    <View style={styles.option}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.subtitle}>{title}</Text>
      <Text style={styles.legend}>Duración: {duration}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowContent(!showContent)}
      >
        <Text style={styles.buttonText}>
          {showContent ? "Ocultar Contenido" : "Ver Contenido"}
        </Text>
      </TouchableOpacity>
      {showContent && (
        <View style={styles.list}>
          {content.map((item, index) => (
            <Text key={index} style={styles.listItem}>
              • {item}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowBenefits(!showBenefits)}
      >
        <Text style={styles.buttonText}>
          {showBenefits ? "Ocultar Beneficios" : "Ver Beneficios"}
        </Text>
      </TouchableOpacity>
      {showBenefits && (
        <View style={styles.list}>
          {benefits.map((item, index) => (
            <Text key={index} style={styles.listItem}>
              • {item}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const CatasVip = () => {
  return (
    <ImageBackground style={styles.imageContainer} source={imageBck}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>CATAS EXCLUSIVAS:</Text>

        <TastingOption
          image={iconBasic}
          title="Cata Inicial: 'Descubre el mundo del café'"
          duration="30-45 minutos"
          content={[
            "Precio: 10-15€ por persona",
            "Presentación de 3-4 cafés de origen diferente.",
            "Explicación breve de cada café, incluyendo su origen, proceso de producción y características organolépticas.",
            "Degustación de cada café, con oportunidad para que los participantes compartan sus impresiones y preguntas.",
            "Moliendas básicas: explicación de las diferencias entre moliendas finas, medias y gruesas, y cómo afectan el sabor y la textura del café.",
          ]}
          benefits={[
            "Ebook 'El arte del café' (valorado en 16 euros).",
            "Conocerás los conceptos básicos del café y podrás apreciar las diferencias entre distintos orígenes y procesos de producción.",
          ]}
        />

        <TastingOption
          image={iconIntermediate}
          title="Cata Premium: 'Explora la diversidad del café'"
          duration="60-120 minutos"
          content={[
            "Precio: 25-35€ por persona",
            "Presentación de 5-6 cafés de alta calidad.",
            "Degustación de cada café, con oportunidad para que los participantes compartan sus impresiones y preguntas.",
            "Moliendas avanzadas: explicación de las diferencias entre moliendas de cono, moliendas de cilindro y moliendas de piedra, y cómo afectan el sabor y la textura del café.",
            "Análisis de las diferencias entre los cafés y discusión sobre las preferencias personales.",
          ]}
          benefits={[
            "Ebook 'El arte del café' (valorado en 16 euros).",
            "Descuento del 10% en compras de café en la tienda durante el mes siguiente.",
            "Conocerás las características y diferencias entre distintos tipos de café y podrás desarrollar tus habilidades de cata.",
          ]}
        />

        <TastingOption
          image={iconVip}
          title="Cata Exclusive: 'Experiencia gourmet de café'"
          duration="120-180 minutos"
          content={[
            "Precio: 50-75€ por persona",
            "Presentación de 7-8 cafés exclusivos y de alta calidad.",
            "Explicación exhaustiva de cada café, incluyendo su origen, proceso de producción, características organolépticas, notas de cata y puntuación en la escala de puntos de la Specialty Coffee Association.",
            "Degustación de cada café, con oportunidad para que los participantes compartan sus impresiones y preguntas.",
            "Moliendas personalizadas: explicación de cómo crear moliendas personalizadas para cada tipo de café según el paladar de cada uno, y cómo afectan el sabor y la textura del café.",
            "Sesión de preguntas y respuestas con un experto en café.",
          ]}
          benefits={[
            "Ebook 'El arte del café' (valorado en 16 euros).",
            "Descuento del 15% en compras de café en la tienda durante el mes siguiente.",
            "Acceso exclusivo a eventos de degustación de café y lanzamientos de nuevos productos.",
            "Conocerás las características y diferencias entre distintos tipos de café y podrás desarrollar tus habilidades de cata de manera avanzada.",
            "Te inscribirás automáticamente en la comunidad de Mr. Coffee con beneficios exclusivos adicionales.",
          ]}
        />
      </ScrollView>
    </ImageBackground>
  );
};

export default CatasVip;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
    fontFamily: 'Jost_700Bold'
  },
  option: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 120,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
    fontFamily: 'Jost_600SemiBold'
  },
  legend: {
    fontSize: 14,
    color: "#ddd",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: 'Jost_400Regular'
  },
  button: {
    backgroundColor: "#c59d5f",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontFamily: 'Jost_600SemiBold',
    textTransform:'uppercase'
  },
  list: {
    marginTop: 8,
  },
  listItem: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
    fontFamily: 'Jost_400Regular'
  },
});
