import { DefaultTheme, DarkTheme as NavigationDarkTheme } from "@react-navigation/native";

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#d4d4d4ff",
    text: "#000000",
    input: "#d8d8d8ff",
    card: "#f2f2f2",
    primary: "#6f4e37",
  },
};

export const DarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: "#000000",
    text: "#d4d4d4ff",
    card: "#1a1a1a",
    input: "#1a1a1a",
    primary: "#c69c6d",
  },
};