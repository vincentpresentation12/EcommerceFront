import { theme } from "@akkurateio/ds";

const custom = theme;

custom.colors.primary = {
  50: "#f0fdf4",
  100: "#dcfce7",
  200: "#bbf7d0",
  300: "#86efac",
  400: "#4ade80",
  500: "#22c55e",
  600: "#16a34a",
  700: "#15803d",
  800: "#166534",
  900: "#14532d",
};
custom.colors.secondary = {
  50: "#f0fdfa",
  100: "#ccfbf1",
  200: "#99f6e4",
  300: "#5eead4",
  400: "#2dd4bf",
  500: "#14b8a6",
  600: "#0d9488",
  700: "#0f766e",
  800: "#115e59",
  900: "#134e4a",
};

custom.colors.bgLight = "#fcfcfc";

custom.colors.lightGray = "#f5f5f5";
custom.colors.mediumGray = "#666666";
custom.colors.darkGray = "#1E1E1E";

custom.config.initialColorMode = "light";
custom.config.useSystemColorMode = false;

export const customTheme = custom;
