import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useTheme } from "@react-navigation/native";

export default function AvatarPicker({ size = 100 }) {
  const {colors} = useTheme()
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar avatar existente si hay sesión
  useEffect(() => {
    const fetchAvatar = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists() && snap.data().avatar) {
        setAvatar(snap.data().avatar);
      }
    };
    fetchAvatar();
  }, []);

  // 🔹 Pedir permisos
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Necesitamos acceso a tus fotos");
      }
    })();
  }, []);

  const storage = getStorage();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        const resized = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 300, height: 300 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        uploadAvatar(resized.uri);
      }
    } catch (err) {
      console.error("Error picking image:", err);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
    }
  };

  const uploadAvatar = async (uri) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión antes de subir un avatar");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `avatars/${user.uid}/avatar.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setAvatar(downloadURL);

      // 🔹 Guarda URL en Firestore
      const userDoc = doc(db, "users", user.uid);
      await setDoc(userDoc, { avatar: downloadURL }, { merge: true });

      Alert.alert("Éxito", "Avatar actualizado correctamente ✅");
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      Alert.alert("Error", "No se pudo subir la imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ alignItems: "center"}}>
      <Text style={{color:colors.text, margin: 6, fontFamily: 'Jost_600SemiBold', textTransform:'uppercase'}}>Foto de perfil:</Text>
      <TouchableOpacity onPress={pickImage}>
        
        {loading ? (
          <ActivityIndicator size="large" color="#a88e19" />
        ) : (
          <Image
            source={
              avatar
                ? { uri: avatar }
                : require("../assets/images/default-avatar.png")
            }
            style={[
              styles.avatar,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 2,
    borderColor: "#a88e19",
    backgroundColor: "#1a1a1a",
  },
});
