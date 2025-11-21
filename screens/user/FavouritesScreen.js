import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
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
import SwipeToDelete from "../../components/SwipeToDelete";

async function prefetchImages(favorites) {
  try {
    const promises = favorites.map((item) => Image.prefetch(item.image));
    await Promise.all(promises);
  } catch (error) {
    console.warn("Error prefetching images:", error);
  }
}

export default function FavoritesScreen() {
  const { favorites = [], deleteFavorite } = useContext(FavoritesContext);
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const goToDetail = (item) => {
    navigation.navigate("Nuestros Cafés", {
      screen: "CoffeeDetail",
      params: { coffeeId: item.id },
    });
  };

  useEffect(() => {
    const loadData = async () => {
      if (!favorites || favorites.length === 0) {
        setLoading(false); // ⚡ importante
        return;
      }
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


  return (
    <View style={[styles.containerList, { backgroundColor: colors.background }]}>
      <CustomHeader title="Mis Favoritos" />
      <View style={{ marginHorizontal: 10 }}>
        {favorites.length > 0 && (
          <Text style={{ fontFamily: "Jost_400Regular", textAlign: "center", marginTop: 10, color: colors.text }}>
           ➔ Desliza hacia la derecha para eliminar un favorito ➔
          </Text>
        )}

        <FlatList
     
          data={favorites || []}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => goToDetail(item)} style={{ marginVertical: 6 }}>
              <SwipeToDelete
                itemId={item.id}
                index={index}
                onSwipe={() => deleteFavorite(item.id, item.name)}
                borderRadius={35}
                icon="trash"
                colors={["#cc0000ff", "#cc0000ff", "#cc000021"]}
              >
                <LinearGradient
                  colors={["#000000ff", "#2b2b2bff", "#000000ff", "#303030ff", "#000000ff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.card]}
                >
                  <Image resizeMode="contain" source={{ uri: item.image }} style={styles.image} />
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.desc}>{item.description}</Text>
                  </View>
                </LinearGradient>
              </SwipeToDelete>
            </TouchableOpacity>
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
  card: { borderRadius: 35, flexDirection: "row", alignItems: "center", padding: 10, shadowColor: "#000", shadowOpacity: 0.25, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 4, height: 90 },
  image: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  name: { color: "#FFD700", fontSize: 16, fontFamily: "Jost_700Bold", marginBottom: 4 },
  desc: { color: "#ccc", fontSize: 13, fontFamily: "Jost_400Regular" },
  swipeAction: { justifyContent: "center", alignItems: "center", paddingLeft: 25, paddingRight: 25, height: 90, borderRadius: 12, borderTopEndRadius: 0, borderBottomEndRadius: 0 },
  swipeText: { color: "#fff", fontWeight: "700", fontSize: 14, marginTop: 4 },
});
