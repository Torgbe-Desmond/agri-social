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
  AppGruvboxDarkTheme,
  AppSilverTheme
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
    if (themeMode === ThemeMode.LIGHT) return AppSolarizedTheme;
    if (themeMode === ThemeMode.DARK) return AppDarkTheme;
    return prefersDark ? AppDarkTheme : AppSolarizedTheme;
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
