// components/RatingStars.js
import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../config/firebase";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "@react-navigation/native";

const RatingStars = ({ coffeeId }) => {
  const { user } = useContext(AuthContext);
  const { colors } = useTheme()
  const [average, setAverage] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);

  useEffect(() => {
    const ref = collection(db, "coffees", coffeeId, "ratings");

    const unsubscribe = onSnapshot(ref, (snap) => {
      const values = snap.docs.map((d) => d.data().value);
      if (values.length === 0) {
        setAverage(0);
        setRatingsCount(0);
        return;
      }
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      setAverage(avg);
      setRatingsCount(values.length);

      // rating del usuario actual si existe
      if (user) {
        const userDoc = snap.docs.find((d) => d.id === user.uid);
        if (userDoc) setUserRating(userDoc.data().value);
      }
    });

    return unsubscribe;
  }, [coffeeId, user]);

  const handleRate = async (value) => {
    if (!user) return; // opcional: abre login

    try {
      const ref = doc(db, "coffees", coffeeId, "ratings", user.uid);
      await setDoc(ref, {
        value,
        createdAt: new Date(),
      });
      setUserRating(value);
    } catch (e) {
      console.log("Error al guardar rating", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: "white" }]}>
        Calificación:
      </Text>

      {/* Estrellas interactivas */}
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => handleRate(n)}>
            <Ionicons
              name={n <= userRating ? "star" : "star-outline"}
              size={32}
              color="gold"
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.subtitle, { color: colors.gray }]}>
        Promedio: {average.toFixed(1)} ⭐ ({ratingsCount} votos)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
    marginBottom: 14
  },
  title: {
    fontSize: 18,
    fontFamily: 'Jost_600SemiBold',
    marginBottom: 10,
    textAlign:'center'
  },
  starsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Jost_500Medium",
    textAlign:'center',
    marginTop: 4,
  },
});

export default RatingStars;
