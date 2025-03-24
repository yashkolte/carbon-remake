'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Use a state initialization function to avoid hydration mismatch
  const [theme, setTheme] = useState<Theme>(() => {
    // Default to light theme during SSR
    return 'light';
  });

  // Handle initialization separately after mount to avoid hydration issues
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage or system preference on client-side only
  useEffect(() => {
    try {
      // Get stored theme from localStorage
      const storedTheme = localStorage.getItem('theme') as Theme | null;

      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
        console.log('Using stored theme:', storedTheme);
        setTheme(storedTheme);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme = prefersDark ? 'dark' : 'light';
        console.log('Using system theme preference:', systemTheme);
        setTheme(systemTheme);
      }
    } catch (error) {
      console.error('Error initializing theme:', error);
      // Fall back to light theme if there's an error
    }

    setIsInitialized(true);
  }, []);

  // Apply theme changes to HTML element and store in localStorage
  useEffect(() => {
    // Only apply theme changes after initialization to avoid hydration issues
    if (!isInitialized) return;

    try {
      console.log('Applying theme:', theme);

      // Set the data-theme attribute on the html element
      document.documentElement.setAttribute('data-theme', theme);

      // Store theme preference in localStorage
      localStorage.setItem('theme', theme);

      // Apply Carbon theme classes
      if (theme === 'dark') {
        document.body.setAttribute('data-carbon-theme', 'g100');
        document.body.classList.add('cds--g100');
        document.body.classList.remove('cds--white');
      } else {
        document.body.setAttribute('data-carbon-theme', 'white');
        document.body.classList.add('cds--white');
        document.body.classList.remove('cds--g100');
      }
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [theme, isInitialized]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        console.log('System theme changed to:', newTheme);
        setTheme(newTheme);
      }
    };

    // Add event listener
    mediaQuery.addEventListener('change', handleChange);

    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('Toggling theme from', prevTheme, 'to', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
