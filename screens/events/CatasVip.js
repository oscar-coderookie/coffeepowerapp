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
import { MotiView } from "moti";
import imageBck from "../../assets/images/catas-movil.webp";
import iconBasic from "../../assets/images/catas-inicial.png";
import iconIntermediate from "../../assets/images/catas-intermediate.png";
import iconVip from "../../assets/images/catas-exclusive.png";
import ButtonGeneral from "../../components/ButtonGeneral";
import { useTheme } from "@react-navigation/native";

const TastingOption = ({ image, title, duration, content, benefits, index }) => {
  const [showContent, setShowContent] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const { colors } = useTheme();

  return (
    <MotiView
      from={{
        opacity: 0,
        translateX: index % 2 === 0 ? -100 : 100, // izquierda/derecha alternado
      }}
      animate={{
        opacity: 1,
        translateX: 0,
      }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 120,
        delay: index * 150, // cada card entra con pequeño retardo
      }}
      style={styles.option}
    >
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.subtitle}>{title}</Text>
      <Text style={styles.legend}>Duración: {duration}</Text>

  

      <ButtonGeneral
        onTouch={() => setShowContent(!showContent)}
        text={showContent ? "Ocultar Contenido" : "Ver Contenido"}
        textColor="#000000ff"
        borderColors={[colors.goldSecondary, colors.gold, colors.goldSecondary, colors.gold, colors.goldSecondary]}
        bckColor={[colors.gold, colors.goldSecondary, colors.gold, colors.goldSecondary, colors.gold]}
        soundType="cup"
      />
      {showContent && (
        <View style={styles.list}>
          {content.map((item, i) => (
            <Text key={i} style={styles.listItem}>
              • {item}
            </Text>
          ))}
        </View>
      )}

      <ButtonGeneral
        onTouch={() => setShowBenefits(!showBenefits)}
        text={showBenefits ? "Ocultar Beneficios" : "Ver Beneficios"}
        textColor="#000000ff"
        borderColors={[colors.goldSecondary, colors.gold, colors.goldSecondary, colors.gold, colors.goldSecondary]}
        bckColor={[colors.gold, colors.goldSecondary, colors.gold, colors.goldSecondary, colors.gold]}
        soundType="cup"
      />

      {showBenefits && (
        <View style={styles.list}>
          {benefits.map((item, i) => (
            <Text key={i} style={styles.listItem}>
              • {item}
            </Text>
          ))}
        </View>
      )}
    </MotiView>
  );
};

const CatasVip = () => {
  const catas = [
    {
      image: iconBasic,
      title: "Cata Inicial: 'Descubre el mundo del café'",
      duration: "30-45 minutos",
      content: [
        "Precio: 10-15€ por persona",
        "Presentación de 3-4 cafés de origen diferente.",
        "Explicación breve de cada café, incluyendo su origen, proceso de producción y características organolépticas.",
        "Degustación de cada café, con oportunidad para que los participantes compartan sus impresiones y preguntas.",
        "Moliendas básicas: diferencias entre moliendas finas, medias y gruesas, y cómo afectan el sabor.",
      ],
      benefits: [
        "Ebook 'El arte del café' (valorado en 16€).",
        "Conocerás los conceptos básicos del café y podrás apreciar las diferencias entre orígenes.",
      ],
    },
    {
      image: iconIntermediate,
      title: "Cata Premium: 'Explora la diversidad del café'",
      duration: "60-120 minutos",
      content: [
        "Precio: 25-35€ por persona",
        "Presentación de 5-6 cafés de alta calidad.",
        "Degustación de cada café, con espacio para impresiones y preguntas.",
        "Moliendas avanzadas: cono, cilindro y piedra, y su impacto en el sabor.",
        "Análisis de diferencias entre cafés y preferencias personales.",
      ],
      benefits: [
        "Ebook 'El arte del café' (valorado en 16€).",
        "Descuento del 10% en compras de café durante el mes siguiente.",
        "Desarrollarás tus habilidades de cata intermedia.",
      ],
    },
    {
      image: iconVip,
      title: "Cata Exclusive: 'Experiencia gourmet de café'",
      duration: "120-180 minutos",
      content: [
        "Precio: 50-75€ por persona",
        "Presentación de 7-8 cafés exclusivos y de alta calidad.",
        "Explicación exhaustiva de cada café: origen, proceso, notas de cata y puntuación SCA.",
        "Degustación con interacción guiada.",
        "Moliendas personalizadas según tu paladar.",
        "Sesión de preguntas y respuestas con un experto en café.",
      ],
      benefits: [
        "Ebook 'El arte del café' (valorado en 16€).",
        "Descuento del 15% en compras durante el mes siguiente.",
        "Acceso a eventos exclusivos y lanzamientos.",
        "Inscripción a la comunidad de Mr. Coffee con beneficios VIP.",
      ],
    },
  ];

  return (
    <ImageBackground style={styles.imageContainer} source={imageBck}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>CATAS EXCLUSIVAS:</Text>

        {catas.map((cata, index) => (
          <TastingOption key={index} {...cata} index={index} />
        ))}
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
    fontFamily: 'Jost_700Bold',
    textShadowColor: "rgba(0, 0, 0, 0.6)", // color y opacidad de la sombra
    textShadowOffset: { width: 2, height: 2 }, // desplazamiento
    textShadowRadius: 6, // difuminado
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
    textTransform: 'uppercase'
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
