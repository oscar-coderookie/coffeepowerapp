import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { Video } from 'expo-video';
import fondo from '../assets/home-movil.mp4';
import logo from '../assets/logo-nuevo.png'

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Video de fondo */}
      <Video
        source={fondo} // 👈 aquí va tu video (puede ser local o url)
        style={styles.backgroundVideo}
        resizeMode="contain"
        shouldPlay
        isLooping
        isMuted
      />

      {/* Contenido encima del video */}
      <View style={styles.overlay}>
        <Image source={logo} style={{width: 200 , height: 200}}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', // opcional: oscurece el video
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
});
