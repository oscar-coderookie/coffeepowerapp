// components/SwipeToDelete.js
import React, { useRef } from "react";
import { View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";

export default function SwipeToDelete({ children, onSwipe, itemId, index = 0, borderRadius, heightContainer }) {
  const swipeableRef = useRef(null);

  const renderLeftActions = () => (
    <LinearGradient
      colors={["#cc0000ff", "#cc0000ff", "#cc000021"]}
      locations={[0, 0.8, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 25,
        paddingRight:40,
        borderRadius: borderRadius,
        borderTopEndRadius: 0,
        borderBottomEndRadius: 0,
      }}
    >
      <Ionicons name="trash" size={30} color="#fff" />
    </LinearGradient>
  );

  return (
    <View
      style={{
        borderRadius: borderRadius,

      }}
    >
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={renderLeftActions}
        friction={2}
        leftThreshold={20}
        overshootLeft={false}
        onSwipeableOpen={() => {
          if (onSwipe) onSwipe(itemId);
          swipeableRef.current?.close();
        }}
      >
        <MotiView
          from={{ opacity: 0, translateX: -30 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: "timing", duration: 420, delay: index * 120 }}
        >
          {children}
        </MotiView>
      </Swipeable>
    </View>

  );
}
