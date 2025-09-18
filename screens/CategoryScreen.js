import { View, Text, StyleSheet, FlatList, Image, ImageBackground, ScrollView } from "react-native";
import { getCoffeesByTag } from '../data/CoffeesData'

export default function CategoryScreen({ route }) {
  const { category } = route.params;

  // OJO: aquí usamos category.key, no category.tags
  const coffees = getCoffeesByTag(category.key);

  return (
    <View style={styles.bg}>
      <View style={styles.overlay}>
        <Text style={styles.title}>{category.name}</Text>
        <Text style={styles.legend}>{category.legend}</Text>

        <FlatList
          data={coffees}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: "cover" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  legend: { fontSize: 16, color: "#ccc", textAlign: "center", marginBottom: 20 },
  card: { flex: 1, backgroundColor: "#111", padding: 15, marginBottom: 15, borderRadius: 10 },
  image: { width: "100%", height: 150, borderRadius: 10, marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  cardDesc: { fontSize: 14, color: "#aaa" },
});