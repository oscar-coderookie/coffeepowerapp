// components/VideoPlayer.js
import React, { useRef, useState } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { Video } from "expo-av";
import LoadingScreen from "./LoadingScreen"; // ajusta ruta si hace falta

const { width } = Dimensions.get("window");

export default function VideoPlayer() {
  const videoUri =
    "https://firebasestorage.googleapis.com/v0/b/chris-rosas-web.appspot.com/o/cafes%2Fvideos%2Fhome-movil.mp4?alt=media&token=7f0b28a2-f374-45df-9f94-752f98284984";

  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping
        useNativeControls={false}
        onLoadStart={() => {
          setLoading(true);
          setError(null);
          console.log("[Video] onLoadStart");
        }}
        onLoad={(meta) => {
          // meta: { durationMillis, naturalSize, ... }
          setLoading(false);
          console.log("[Video] onLoad", meta);
        }}
        onError={(e) => {
          setLoading(false);
          setError(e);
          console.log("[Video] onError", e);
        }}
        onPlaybackStatusUpdate={(status) => {
          // status.isLoaded, status.isPlaying, status.isBuffering, etc
          // útil para debug
          // console.log("[Video] status", status);
          if (status && status.isLoaded && !status.isBuffering && status.isPlaying) {
            setLoading(false);
          }
        }}
      />

      {loading && (
        <View style={styles.overlay}>
          {/* Si LoadingScreen es un componente grande, lo puedes reemplazar por ActivityIndicator */}
          {LoadingScreen ? <LoadingScreen /> : <ActivityIndicator size="large" color="#D4AF37" />}
        </View>
      )}

      {error && (
        <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.6)" }]}>
          {/* Mensaje simple cuando hay error */}
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    aspectRatio: 5 / 9,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width,
    aspectRatio: 5 / 9,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
