import { createTheming } from "@callstack/react-theme-provider";

export const themes = {
  default: {
    primaryColor: "#FFC777",
    accentColor: "#ffea80",
    backgroundColor: "#FFA72A",
    textColor: "#504f4d",
    secondaryColor: "#7F5315",
    successColor: "#52b653"
  },
  dark: {
    primaryColor: "#FFA72A",
    accentColor: "#458622",
    backgroundColor: "#504f4d",
    textColor: "#FFC777",
    secondaryColor: "#252525"
  }
};

const { ThemeProvider, useTheme } = createTheming(themes.default);

export { ThemeProvider, useTheme };
