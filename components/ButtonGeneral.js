import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";

const ButtonGeneral = ({
  onTouch,
  bckColor,
  text,
  textColor,
  marginHorizontal,
  disable,
  borderColors = ["#c9b58a", "#fff1cc", "#b89465"], // degradado dorado/cobre
}) => {
  const isGradient = Array.isArray(bckColor);
  const isBorderGradient = Array.isArray(borderColors);

  return (
    <TouchableOpacity
      disabled={disable}
      onPress={onTouch}
      activeOpacity={0.85}
      style={{
        marginVertical: 3,
        marginHorizontal,
        borderRadius: 8,
        overflow: "hidden",
        opacity: disable ? 0.6 : 1,
      }}
    >
      {/* Capa del borde metálico */}
      <View
        style={{
          borderRadius: 12,
          padding: 2,
          position: "relative",
        }}
      >
        {/* Gradiente del borde base */}
        <LinearGradient
          colors={isBorderGradient ? borderColors : [borderColors, borderColors]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 12,
            padding: 2,
          }}
        >
          {/* ✨ Reflejo dinámico del borde (efecto metálico) */}
          <MotiView
            from={{ translateX: -150, opacity: 0 }}
            animate={{ translateX: 250, opacity: 1 }}
            transition={{
              repeat:Infinity,
              duration: 6000,
              easing: Easing.out(Easing.exp),// suaviza la curva
             
            }}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: "rgba(255,255,255,0.5)",
              opacity: 0.4,
            }}
          />

          {/* Contenedor interno */}
          <View
            style={{
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: "transparent",
            }}
          >
            {/* Reflejo interno del botón */}
            <MotiView
              from={{ translateX: -150 }}
              animate={{ translateX: 150 }}
              transition={{
                loop: true,
                duration: 3500,
                easing: "ease-in-out",
              }}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: 80,
                backgroundColor: "rgba(255,255,255,0.1)",
                transform: [{ rotate: "20deg" }],
              }}
            />

            {/* Fondo principal */}
            {isGradient ? (
              <LinearGradient
                colors={bckColor}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  padding: 16,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Jost_700Bold",
                    textTransform: "uppercase",
                    textAlign: "center",
                    color: textColor,
                    textShadowColor: "rgba(255,255,255,0.3)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  {text}
                </Text>
              </LinearGradient>
            ) : (
              <Text
                style={{
                  fontFamily: "Jost_700Bold",
                  textTransform: "uppercase",
                  textAlign: "center",
                  color: textColor,
                  backgroundColor: bckColor,
                  padding: 16,
                  borderRadius: 10,
                  textShadowColor: "rgba(255,255,255,0.3)",
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                }}
              >
                {text}
              </Text>
            )}
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonGeneral;
