import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";

const MarqueeTitle = ({ title, gap = 40 }) => {
  const translateX = useSharedValue(0);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textWidth === 0) return;

    // desplazamos un bloque completo (texto + gap)
    translateX.value = withRepeat(
      withTiming(-textWidth, {
        duration: textWidth * 20, // velocidad proporcional al tamaño
        easing: Easing.linear,
      }),
      -1, // infinito
      false
    );
  }, [textWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.row, animatedStyle]}>
        {/* Bloque 1 */}
        <Text
          style={[styles.text, { paddingRight: gap }]}
          onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
        >
          {title}
        </Text>
        {/* Bloque 2 */}
        <Text style={[styles.text, { paddingRight: gap }]}>{title}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign:'center'
  },
});

export default MarqueeTitle;
