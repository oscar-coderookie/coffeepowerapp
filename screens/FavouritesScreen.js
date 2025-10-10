import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";
import FavouriteButton from "../components/FavouriteButton";
import { FavoritesContext } from "../context/FavoritesContext";

export default function FavoritesScreen() {
  const { favorites } = useContext(FavoritesContext);
  const { colors } = useTheme();

  if (!favorites || favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>⭐ Aún no tienes favoritos ⭐</Text>
      </View>
    );
  }

  return (
    <View style={[styles.containerList, { backgroundColor: colors.background }]}>
      <CustomHeader title="Tus Favoritos" />
      <FlatList
        style={{ marginTop: 20 }}
        data={favorites}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.desc}>{item.descripcion}</Text>
            </View>
            <FavouriteButton cafe={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  containerList: {
    flex: 1,
    padding: 16,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Jost_600SemiBold",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
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
