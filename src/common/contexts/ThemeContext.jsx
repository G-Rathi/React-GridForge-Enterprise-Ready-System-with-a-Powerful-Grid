import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEMES.SYSTEM);

  const toggleTheme = () => {
    setTheme(prev => 
      prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};