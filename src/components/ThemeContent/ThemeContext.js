import React, { useMemo, useState, useEffect } from "react";
import { useMediaQuery, ThemeProvider, CssBaseline } from "@mui/material";

import { ThemeMode } from "./constants";
import {
  AppDarkTheme,
  AppLightTheme,
  AppSolarizedTheme,
  AppDraculaTheme,
  AppOneDarkTheme,
  AppPalenightTheme,
  AppMonokaiTheme,
  AppNordTheme,
  AppGruvboxDarkTheme
} from "./themes";
import { ThemeContext } from "./context";
import { updateBodyClassesAndMeta } from "./utils";
import { useDispatch } from "react-redux";

export const ThemeProviderWrapper = ({ children }) => {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const systemTheme = prefersDark ? ThemeMode.DARK : ThemeMode.LIGHT;
  const dispatch = useDispatch();
  const [themeMode, setThemeMode] = useState(ThemeMode.SYSTEM);

  const selectedTheme = useMemo(() => {
    if (themeMode === ThemeMode.LIGHT) return AppLightTheme;
    if (themeMode === ThemeMode.DARK) return AppSolarizedTheme;
    return prefersDark ? AppSolarizedTheme : AppLightTheme;
  }, [themeMode, prefersDark]);

  useEffect(() => {
    updateBodyClassesAndMeta(selectedTheme.palette.mode);
  }, [selectedTheme]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, ThemeMode }}>
      <ThemeProvider theme={selectedTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
