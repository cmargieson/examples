import React from "react";

const baseTheme = {
  COLORS: {
    BACKGROUND: "white",
    PRIMARY: "palevioletred",
  },
  SIZES: {
    FONT: 16,
  },
};

const ThemeContext = React.createContext();

export const ThemeProvider = ({ children, theme = {} }) => {
  const providerTheme = {
    COLORS: { ...baseTheme.COLORS, ...theme.COLORS },
    SIZES: { ...baseTheme.SIZES, ...theme.SIZES },
  };

  return (
    <ThemeContext.Provider value={providerTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const withTheme = (Component, styles) => (props) => (
  <ThemeContext.Consumer>
    {(theme) => (
      <Component {...props} theme={theme} styles={styles && styles(theme)} />
    )}
  </ThemeContext.Consumer>
);
