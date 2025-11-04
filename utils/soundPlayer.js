// utils/soundPlayer.js
import { Audio } from 'expo-av';

const sounds = {
  click: require('../assets/sounds/sonido1.mp3'), // clic metálico / gota de café
  cart: require('../assets/sounds/cart.mp3'), // abrir panel
  switch: require('../assets/sounds/switch.m4a'), // espresso shot
  cup: require('../assets/sounds/cup.mp3'), // espresso shot
  favorite: require('../assets/sounds/favorite.mp3'), // espresso shot
};

let soundObjects = {};

export const playSound = async (type, volume = 0.2) => {
  try {
    if (!sounds[type]) return;
    
    if (!soundObjects[type]) {
      const { sound } = await Audio.Sound.createAsync(sounds[type], { volume });
      soundObjects[type] = sound;
    }

    await soundObjects[type].replayAsync();
  } catch (error) {
    console.log('Error reproduciendo sonido:', error);
  }
};

// Opcional: liberar recursos
export const unloadSounds = async () => {
  for (let key in soundObjects) {
    await soundObjects[key].unloadAsync();
  }
  soundObjects = {};
};
