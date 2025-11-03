import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/CustomHeader";
import FavouriteButton from "../../components/FavouriteButton";
import { FavoritesContext } from "../../context/FavoritesContext";
import { MotiView } from "moti";
import LoadingScreen from "../../components/LoadingScreen";
import { LinearGradient } from "expo-linear-gradient";

async function prefetchImages(favorites) {
  try {
    const promises = favorites.map((item) => Image.prefetch(item.image));
    await Promise.all(promises);
  } catch (error) {
    console.warn("Error prefetching images:", error);
  }
}

export default function FavoritesScreen() {
  const { favorites } = useContext(FavoritesContext);
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);

  // Esperamos a que favorites esté definido (puede venir de async)
  useEffect(() => {
    const loadData = async () => {
      if (!favorites) return;
      await prefetchImages(favorites); // ⬅ prefetch de imágenes
      setLoading(false);
    };
    loadData();
  }, [favorites]);

  if (loading) return <LoadingScreen />;

  if (!favorites || favorites.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CustomHeader title="Mis Favoritos" />
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text style={[styles.text, { color: colors.text }]}>⭐ Aún no tienes favoritos ⭐</Text>
        </View>

      </View>
    );
  }

  return (
    <View style={[styles.containerList, { backgroundColor: colors.background }]}>
      <CustomHeader title="Mis Favoritos" />
      <View style={{ marginHorizontal: 10 }}>
        <Text style={{ fontFamily: "Jost_400Regular", textAlign: "center", marginTop: 10, color: colors.text }}>
          Aquí podréis gestionar vuestros favoritos, agregar o eliminar:
        </Text>

        <FlatList
          style={{ marginTop: 20 }}
          data={favorites}
          extraData={favorites}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateX: -30 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{
                type: "timing",
                duration: 420,
                delay: index * 120, // <-- escalonado por índice
              }}
              style={{ marginBottom: 12 }}
            >
              <LinearGradient
                colors={["#000000ff", "#2b2b2bff", "#000000ff","#303030ff","#000000ff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.card]}>
                <Image resizeMode="contain" source={{ uri: item.image }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.nombre}</Text>
                  <Text style={styles.desc}>{item.descripcion}</Text>
                </View>
                <FavouriteButton cafe={item} />
              </LinearGradient>
            </MotiView>
          )}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  containerList: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    fontFamily: "Jost_600SemiBold",
    textAlign: "center",
  },
  card: {
    borderRadius: 12,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    color: "#FFD700",
    fontSize: 16,
    fontFamily: "Jost_700Bold",
    marginBottom: 4,
  },
  desc: {
    color: "#ccc",
    fontSize: 13,
    fontFamily: "Jost_400Regular",
  },
});
