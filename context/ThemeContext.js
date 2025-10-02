// context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { DarkTheme, LightTheme } from "@react-navigation/native";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(null); // 👈 null = automático
  const [theme, setTheme] = useState(LightTheme);

  useEffect(() => {
    if (isDark === null) {
      // 👈 Automático por hora
      const hour = new Date().getHours();
      const autoDark = hour >= 18 || hour < 6;
      setTheme(autoDark ? DarkTheme : LightTheme);
    } else {
      // 👈 Manual por switch
      setTheme(isDark ? DarkTheme : LightTheme);
    }
  }, [isDark]);

  const toggleTheme = () => {
    // Si estaba en automático (null), empieza en claro
    if (isDark === null) {
      setIsDark(true);
    } else {
      setIsDark(!isDark);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
