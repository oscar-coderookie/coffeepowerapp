import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import { Video } from "expo-av";
import fondo from "../assets/images/home-movil.mp4";


const {  height } = Dimensions.get("window"); 

export default function VideoBanner() {

  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current?.playAsync();
  }, []);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={fondo}
        style={styles.video}
         resizeMode={Video.RESIZE_MODE_COVER} // 👈 aquí el cambio
        isMuted={true}
        isLooping={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height:height , // 👈 altura fija para el bloque dentro del scroll // opcional si quieres bordes redondeados
  },
  video: {
    height: "100%",
  },
});
