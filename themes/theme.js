import { DefaultTheme, DarkTheme as NavigationDarkTheme } from "@react-navigation/native";

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#f2f2f2",
    text: "#000000",
    input: "#d8d8d8ff",
    card: "#d6d6d6ff",
    border: "#c2c2c2ff",
    gold: "#8d701aff",
    goldSecondary: "#dbbd62ff",
    gray: "#e6e6e6ff",
  },
};

export const DarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: "#161616ff",
    text: "#f2f2f2",
    card: "#0f0f0fff",
    input: "#1a1a1a",
    border: "#747474ff",
    gold: "#8d701aff",
    goldSecondary: "#dbbd62ff",
    gray: '#3f3f3fff'
  },
};