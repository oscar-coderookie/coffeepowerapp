import { DefaultTheme, DarkTheme as NavigationDarkTheme } from "@react-navigation/native";

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background:"#f2f2f2" ,
    text: "#000000",
    input: "#d8d8d8ff",
    card: "#d6d6d6ff",
    border: "#c2c2c2ff",
    gold: "#8d701aff",
    goldSecondary:"#dbbd62ff",
  },
};

export const DarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: "#161616ff",
    text: "#c7c7c7ff",
    card: "#000000ff",
    input: "#1a1a1a",
    border: "#747474ff",
    gold: "#8d701aff",
    goldSecondary:"#dbbd62ff",
  },
};