// components/RatingStars.js (lee reviews correctamente)
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useTheme } from "@react-navigation/native";

const RatingStars = ({ coffeeId }) => {
  const { colors } = useTheme();
  const [average, setAverage] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);

  useEffect(() => {
    const ref = collection(db, "coffees", coffeeId, "reviews");

    const unsubscribe = onSnapshot(ref, (snap) => {
      const values = snap.docs.map((d) => d.data().stars);

      if (values.length === 0) {
        setAverage(0);
        setReviewsCount(0);
        return;
      }

      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      setAverage(avg);
      setReviewsCount(values.length);
    });

    return unsubscribe;
  }, [coffeeId]);

  const renderStars = () => {
    const full = Math.floor(average);
    const hasHalf = average % 1 >= 0.25 && average % 1 <= 0.75;
    const empty = 5 - full - (hasHalf ? 1 : 0);

    const stars = [];

    for (let i = 0; i < full; i++) {
      stars.push(<Ionicons key={`f-${i}`} name="star" size={28} color="gold" />);
    }

    if (hasHalf) {
      stars.push(<Ionicons key="half" name="star-half" size={28} color="gold" />);
    }

    for (let i = 0; i < empty; i++) {
      stars.push(
        <Ionicons key={`e-${i}`} name="star-outline" size={28} color="gold" />
      );
    }

    return stars;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title]}>
        Calificación promedio
      </Text>

      <View style={styles.starsRow}>{renderStars()}</View>

      <Text style={[styles.subtitle, { color: colors.gray }]}>
        {average.toFixed(1)} ⭐ ({reviewsCount} reseñas)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontFamily: "Jost_600SemiBold",
    marginBottom: 10,
    textAlign: "center",
    color:'white'
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Jost_500Medium",
    textAlign: "center",
    marginTop: 4,
  },
});

export default RatingStars;
