import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import LoadingScreen from "../../components/LoadingScreen";
import CustomHeader from "../../components/CustomHeader";
import { useTheme } from "@react-navigation/native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { playSound } from "../../utils/soundPlayer";
import Toast from "react-native-toast-message";

export default function UsersAdminScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();
  const animations = useRef([]).current;

  // Escuchar colección de usuarios
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(list);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Animaciones escalonadas
  useEffect(() => {
    if (animations.length !== users.length) {
      animations.length = users.length;
    }

    users.forEach((_, i) => {
      if (!animations[i]) {
        animations[i] = new Animated.Value(0);
      }
    });

    if (users.length === 0) return;

    Animated.stagger(
      100,
      animations
        .slice(0, users.length)
        .map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          })
        )
    ).start();
  }, [users]);



  // Render de cada item
  const renderItem = ({ item, index }) => {
    if (!animations[index]) animations[index] = new Animated.Value(0);

    const anim = animations[index];
    const opacity = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 0],
    });

    return (
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>
            {item.name}
          </Text>
  
        </View>

        <TouchableOpacity
          onPress={() => {
            playSound('click')
            navigation.navigate("Editar Usuario", { user: item })
          }}
          style={{ padding: 10, borderRadius: 10, backgroundColor: "green" }}
        >
          <MaterialIcons name="mode-edit" size={24} color={colors.background} />
        </TouchableOpacity>


      </Animated.View>
    );
  };

  if (loading) return <LoadingScreen message="Cargando usuarios..." />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ marginHorizontal: 10 }}>
        <Text style={{ fontFamily: 'Jost_400Regular', marginVertical: 10, textAlign: 'justify', color: colors.text }}>Aqui podréis listar, editar datos y eliminar los usuarios registrados de vuestra app:</Text>
        <Animated.FlatList
          data={users}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingBottom: 80 },
  card: {
    flexDirection: "row",
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
  },
  info: { flex: 1 },
  name: {
    fontFamily: "Jost_400Regular",
    textTransform: "capitalize",
    marginLeft: 10
  },
  email: {
    fontFamily: "Jost_600SemiBold",
    marginTop: 6,
  },
  addButton: {
    alignItems: "center",
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  addText: {
    fontFamily: "Jost_600SemiBold",
    marginLeft: 10,
    textTransform: "uppercase",
  },
});
