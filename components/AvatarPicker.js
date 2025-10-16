// components/AvatarPicker.js
import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useTheme } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AvatarPicker({ size = 100 }) {
  const { colors } = useTheme();
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const storage = getStorage();
  const PERMISSION_KEY = "avatar_permission_alert_shown";

  // 🔹 Cargar avatar existente
  useEffect(() => {
    const fetchAvatar = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists() && snap.data().avatar) {
          setAvatar(snap.data().avatar);
        }
      } catch (err) {
        console.error("Error cargando avatar:", err);
      }
    };
    fetchAvatar();
  }, []);

  // 🔹 Pedir permisos de manera segura con AsyncStorage
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const alertShown = await AsyncStorage.getItem(PERMISSION_KEY);
        if (alertShown === "true") return; // ya mostramos alert antes

        const { status: existingStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();

        if (existingStatus !== "granted") {
          const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (newStatus !== "granted") {
            Alert.alert(
              "Permiso denegado",
              "Necesitamos acceso a tus fotos para que puedas subir tu avatar."
            );
          }
        }

        await AsyncStorage.setItem(PERMISSION_KEY, "true"); // guardamos que ya mostramos alert
      } catch (err) {
        console.error("Error revisando permisos:", err);
      }
    };
    checkPermissions();
  }, []);

  // 🔹 Subir avatar nuevo
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
      console.error("Error seleccionando imagen:", err);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
    }
  };

  // 🔹 Subir avatar a Firebase Storage y actualizar Firestore
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

  // 🔹 Eliminar avatar
  const deleteAvatar = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!avatar) {
      Alert.alert("Aviso", "No tienes un avatar para eliminar");
      return;
    }

    try {
      setLoading(true);

      const storageRef = ref(storage, `avatars/${user.uid}/avatar.jpg`);
      await deleteObject(storageRef).catch((err) => {
        console.log("Archivo no encontrado en Storage, continuar...", err);
      });

      const userDoc = doc(db, "users", user.uid);
      await setDoc(userDoc, { avatar: "" }, { merge: true });

      setAvatar(null);

      Alert.alert("Eliminado", "Tu avatar ha sido eliminado ✅");
    } catch (err) {
      console.error("Error eliminando avatar:", err);
      Alert.alert("Error", "No se pudo eliminar el avatar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ position: "relative" }}>
        <TouchableOpacity
          onPress={pickImage}
          onLongPress={() =>
            Alert.alert(
              "Eliminar Avatar",
              "¿Seguro que quieres eliminar tu avatar actual?",
              [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: deleteAvatar },
              ]
            )
          }
        >
          {loading ? (
            <ActivityIndicator size="large" color="#a88e19" />
          ) : (
            <Image
              source={
                avatar
                  ? { uri: avatar }
                  : require("../assets/images/default-avatar.png")
              }
              style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
            />
          )}
        </TouchableOpacity>

        {/* 🔹 Ícono de lápiz */}
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.editIconContainer, { bottom: 4, right: 4 }]}
        >
          <Icon name="edit" size={18} color={colors.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 2,
    borderColor: "#a88e19",
    backgroundColor: "#1a1a1a",
  },
  editIconContainer: {
    position: "absolute",
    borderRadius: 20,
    padding: 6,
    backgroundColor: "#a88e16ff",
  },
});
