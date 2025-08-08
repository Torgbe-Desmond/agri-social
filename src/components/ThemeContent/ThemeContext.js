import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useMediaQuery,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";

// Theme mode constants
const ThemeMode = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

// ✅ Common typography configuration to preserve your preferred font
const commonTypography = {
  typography: {
    fontFamily: `"Arial", "Helvetica", "sans-serif"`, // Replace with your preferred fonts
  },
};

// ✅ Light Theme
const AppLightTheme = createTheme({
  palette: {
    background: {
      default: "#FFF",
      paper: "#F5F5F5",
    },
    primary: {
      main: "#088A6A",
    },
    secondary: {
      main: "#3AAA49",
    },
  },
  ...commonTypography,
});

// ✅ Dark Theme
const AppDarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000",
      paper: "rgb(31, 33, 34)",
    },
     primary: {
      main: "#088A6A",
    },
    secondary: {
      main: "#3AAA49",
    },
  },
  ...commonTypography,
});

// Theme context to control theme switching
const ThemeContext = createContext();

// Custom hook to access the theme
export const useAppTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProviderWrapper = ({ children }) => {
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const systemTheme = systemPrefersDark ? ThemeMode.DARK : ThemeMode.LIGHT;
  const [themeMode, setThemeMode] = useState(ThemeMode.SYSTEM);

  const theme = useMemo(() => {
    if (themeMode === ThemeMode.LIGHT) return AppLightTheme;
    if (themeMode === ThemeMode.DARK) return AppDarkTheme;
    return systemPrefersDark ? AppDarkTheme : AppLightTheme;
  }, [themeMode, systemPrefersDark]);

  // Update body class and meta theme-color
  useEffect(() => {
    document.body.classList.toggle("dark-mode", theme.palette.mode === "dark");
    document.body.classList.toggle("light-mode", theme.palette.mode === "light");

    const themeColorMeta = document.querySelector("meta[name='theme-color']");
    if (themeColorMeta) {
      themeColorMeta.setAttribute(
        "content",
        theme.palette.mode === "dark" ? "#323537" : "#ffffff"
      );
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, ThemeMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
