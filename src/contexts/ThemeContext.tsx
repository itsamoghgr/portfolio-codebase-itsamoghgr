'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#0078ff',
        light: '#4da6ff',
        dark: '#0056cc',
        contrastText: '#ffffff'
      },
      secondary: {
        main: '#64ffda',
        light: '#9efff3',
        dark: '#00bfa5',
        contrastText: '#000000'
      },
      background: {
        default: isDarkMode ? '#0a0a0a' : '#ffffff',
        paper: isDarkMode ? '#1a1a1a' : '#f8f9fa'
      },
      text: {
        primary: isDarkMode ? '#ffffff' : '#0a090f',
        secondary: isDarkMode ? '#b3b3b3' : '#4e4e4e'
      },
      divider: isDarkMode ? '#333333' : '#e0e0e0'
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Raleway", sans-serif',
        fontWeight: 800,
        letterSpacing: '-0.02em'
      },
      h2: {
        fontFamily: '"Raleway", sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.01em'
      },
      h3: {
        fontFamily: '"Raleway", sans-serif',
        fontWeight: 600
      },
      body1: {
        lineHeight: 1.7,
        fontWeight: 400
      },
      body2: {
        lineHeight: 1.6,
        fontWeight: 400
      }
    },
    shape: {
      borderRadius: 12
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '1rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0, 120, 255, 0.3)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(10px)',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              '& fieldset': {
                border: 'none'
              },
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)'
              },
              '&.Mui-focused': {
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 1)',
                boxShadow: '0 0 0 2px rgba(0, 120, 255, 0.3)'
              }
            }
          }
        }
      }
    }
  });

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};