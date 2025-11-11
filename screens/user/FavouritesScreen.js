import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/CustomHeader";
import { FavoritesContext } from "../../context/FavoritesContext";
import { MotiView } from "moti";
import LoadingScreen from "../../components/LoadingScreen";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { playSound } from "../../utils/soundPlayer";
import Toast from "react-native-toast-message";

async function prefetchImages(favorites) {
  try {
    const promises = favorites.map((item) => Image.prefetch(item.image));
    await Promise.all(promises);
  } catch (error) {
    console.warn("Error prefetching images:", error);
  }
}

export default function FavoritesScreen() {
  const { favorites, setFavorites } = useContext(FavoritesContext);
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const swipeableRefs = useRef(new Map());
  const user = auth.currentUser;

  useEffect(() => {
    const loadData = async () => {
      if (!favorites) return;
      await prefetchImages(favorites);
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

  const renderLeftActions = () => (
    <LinearGradient
      colors={["#cc0000ff", "#cc0000ff", "#ffffff04"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.swipeAction, { height: 90 }]}
    >
      <Ionicons name="trash" size={30} color="#fff" />
    </LinearGradient>
  );

  const handleSwipeToDelete = async (item) => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return;

      const currentFavs = snap.data().favorites || [];
      const updatedFavs = currentFavs.filter(
        (f) => f.nombre?.toLowerCase() !== item.nombre?.toLowerCase()
      );

      await updateDoc(userRef, { favorites: updatedFavs });
      setFavorites(updatedFavs);

      playSound("delete");
      Toast.show({
        type: "success",
        text1: item.nombre,
        text2: "Eliminado de tus favoritos",
      });

      const ref = swipeableRefs.current.get(item.id);
      if (ref) ref.close();

    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo eliminar de favoritos. Intenta de nuevo.",
      });
    }
  };

  return (
    <View style={[styles.containerList, { backgroundColor: colors.background }]}>
      <CustomHeader title="Mis Favoritos" />
      <View style={{ marginHorizontal: 10 }}>
        <Text style={{ fontFamily: "Jost_400Regular", textAlign: "center", marginTop: 10, color: colors.text }}>
          Desliza hacia la derecha para eliminar un favorito:
        </Text>

        <FlatList
          style={{ marginTop: 20 }}
          data={favorites}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
          renderItem={({ item, index }) => (
            <Swipeable
              ref={(ref) => swipeableRefs.current.set(item.id, ref)}
              renderLeftActions={renderLeftActions}
              friction={2}
              leftThreshold={20}
              overshootLeft={false}
              onSwipeableOpen={() => handleSwipeToDelete(item)}
            >
              <MotiView
                from={{ opacity: 0, translateX: -30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "timing", duration: 420, delay: index * 120 }}
                style={{ marginBottom: 12 }}
              >
                <LinearGradient
                  colors={["#000000ff", "#2b2b2bff", "#000000ff", "#303030ff", "#000000ff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.card]}
                >
                  <Image resizeMode="contain" source={{ uri: item.image }} style={styles.image} />
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.nombre}</Text>
                    <Text style={styles.desc}>{item.descripcion}</Text>
                  </View>
                </LinearGradient>
              </MotiView>
            </Swipeable>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  containerList: { flex: 1 },
  text: { fontSize: 18, fontFamily: "Jost_600SemiBold", textAlign: "center" },
  card: { borderRadius: 12, marginBottom: 4, flexDirection: "row", alignItems: "center", padding: 10, shadowColor: "#000", shadowOpacity: 0.25, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 4, height: 90 },
  image: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  name: { color: "#FFD700", fontSize: 16, fontFamily: "Jost_700Bold", marginBottom: 4 },
  desc: { color: "#ccc", fontSize: 13, fontFamily: "Jost_400Regular" },
  swipeAction: { justifyContent: "center", alignItems: "center", paddingLeft: 25, paddingRight: 25, height: 90, borderRadius: 12, borderTopEndRadius: 0, borderBottomEndRadius: 0 },
  swipeText: { color: "#fff", fontWeight: "700", fontSize: 14, marginTop: 4 },
});
