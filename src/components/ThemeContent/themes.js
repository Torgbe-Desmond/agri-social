import { createTheme } from "@mui/material/styles";

const commonTypography = {
  typography: {
    fontFamily: `"JetBrains Mono", "monospace"`,
  },
};

export const AppLightTheme = createTheme({
  palette: {
    mode: "light",
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

export const AppDarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212", // true dark gray background
      paper: "#1E1E1E", // slightly lighter for cards/panels
    },
    primary: {
      main: "#08A68F", // teal-ish, stands out on dark
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#4CAF50", // green accent
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#E0E0E0", // light gray for main text
      secondary: "#B0B0B0", // slightly dimmer for secondary text
    },
    divider: "#333", // subtle dividers
  },
  shape: {
    borderRadius: 8, // slightly rounded corners
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // remove default gradients
        },
      },
    },
  },
  ...commonTypography,
});

export const AppPalenightTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#292D3E",
      paper: "#32374D",
    },
    primary: {
      main: "#82AAFF", // bright blue
    },
    secondary: {
      main: "#C792EA", // purple
    },
    text: {
      primary: "#EEFFFF", // near-white
      secondary: "#676E95", // muted gray
    },
  },
  typography: {
    fontFamily: `"Operator Mono", "monospace"`,
  },
});

export const AppNightOwlTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#011627", // deep navy
      paper: "#1D3B53",
    },
    primary: {
      main: "#82AAFF", // soft blue
    },
    secondary: {
      main: "#7FDBCA", // teal
    },
    text: {
      primary: "#D6DEEB",
      secondary: "#5F7E97",
    },
  },
  typography: {
    fontFamily: `"Dank Mono", "monospace"`,
  },
});

export const AppCobalt2Theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#193549", // cobalt blue
      paper: "#1F4662",
    },
    primary: {
      main: "#FF9D00", // orange
    },
    secondary: {
      main: "#FF628C", // pink
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#9EFFFF", // cyan hints
    },
  },
  typography: {
    fontFamily: `"Source Code Pro", "monospace"`,
  },
});

export const AppMaterialDarkerTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#212121", // deep dark gray
      paper: "#2C2C2C",
    },
    primary: {
      main: "#82AAFF", // light blue
    },
    secondary: {
      main: "#C792EA", // soft purple
    },
    text: {
      primary: "#EEFFFF",
      secondary: "#B0BEC5",
    },
  },
  typography: {
    fontFamily: `"JetBrains Mono", "monospace"`,
  },
});

export const AppGruvboxDarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#282828", // dark background
      paper: "#3C3836", // softer background
    },
    primary: {
      main: "#FB4934", // bright red
    },
    secondary: {
      main: "#B8BB26", // olive green
    },
    text: {
      primary: "#EBDBB2", // warm beige
      secondary: "#A89984", // muted brown-gray
    },
  },
  typography: {
    fontFamily: `"Fira Code", "monospace"`,
  },
});

export const AppSolarizedTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#FDF6E3",
      paper: "#EEE8D5",
    },
    primary: {
      main: "#268BD2",
    },
    secondary: {
      main: "#2AA198",
    },
  },
  typography: {
    fontFamily: `"Fira Code", "Courier New", monospace`,
  },
});

export const AppDraculaTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#282A36",
      paper: "#44475A",
    },
    primary: {
      main: "#BD93F9",
    },
    secondary: {
      main: "#FF79C6",
    },
  },
  typography: {
    fontFamily: `"JetBrains Mono", "monospace"`,
  },
});

// Monokai-inspired theme
export const AppMonokaiTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#272822",
      paper: "#3E3D32",
    },
    primary: {
      main: "#F92672", // pinkish red
    },
    secondary: {
      main: "#A6E22E", // bright green
    },
    text: {
      primary: "#F8F8F2", // off-white text
      secondary: "#75715E",
    },
  },
  typography: {
    fontFamily: `"Fira Code", "monospace"`,
  },
});

// Nord-inspired theme
export const AppNordTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#2E3440",
      paper: "#3B4252",
    },
    primary: {
      main: "#81A1C1", // icy blue
    },
    secondary: {
      main: "#88C0D0", // lighter blue
    },
    text: {
      primary: "#D8DEE9",
      secondary: "#4C566A",
    },
  },
  typography: {
    fontFamily: `"Roboto Mono", "monospace"`,
  },
});

// Solarized Dark theme
export const AppSolarizedDarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#002B36",
      paper: "#073642",
    },
    primary: {
      main: "#268BD2", // blue
    },
    secondary: {
      main: "#2AA198", // cyan/teal
    },
    text: {
      primary: "#839496",
      secondary: "#586E75",
    },
  },
  typography: {
    fontFamily: `"Source Code Pro", "monospace"`,
  },
});

// One Dark Pro inspired theme
export const AppOneDarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#282C34",
      paper: "#21252B",
    },
    primary: {
      main: "#61AFEF", // bright blue
    },
    secondary: {
      main: "#E06C75", // soft red
    },
    text: {
      primary: "#ABB2BF",
      secondary: "#5C6370",
    },
  },
  typography: {
    fontFamily: `"Operator Mono", "monospace"`,
  },
});

// One Dark Pro inspired theme with farming-friendly green background
export const AppTwoDarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#2D3C28", // muted green background
      paper: "#242E20", // darker for cards/dialogs
    },
    primary: {
      main: "#7EC86B", // fresh green for primary actions
    },
    secondary: {
      main: "#E5C07B", // golden-wheat tone for farming feel
    },
    text: {
      primary: "#E6F0E6", // soft off-white for contrast on green
      secondary: "#A6B2A6", // muted green-gray for secondary text
    },
    divider: "#3C4B38", // subtle greenish divider
  },
  typography: {
    fontFamily: `"Operator Mono", "monospace"`,
  },
});
